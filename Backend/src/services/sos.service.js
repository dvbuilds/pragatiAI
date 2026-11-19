import ApiError from '../utils/ApiError.js';

/**
 * SOS / emergency-services lookup.
 *
 * Data comes from OpenStreetMap (Overpass API for places, Nominatim for
 * geocoding a PIN code / area name). Neither needs an API key. OSM coverage
 * of phone numbers and addresses is community-maintained and incomplete, so
 * every field except name/coordinates/distance is optional and the UI must
 * handle its absence.
 *
 * This module only *finds* services. It never dispatches anything.
 */

// ── Categories ──────────────────────────────────────────────────────────────
// Each category maps to the OSM tag filters that identify it.
export const SOS_CATEGORIES = {
  police: {
    label: 'Police station',
    selectors: ['["amenity"="police"]'],
  },
  ambulance: {
    label: 'Ambulance service',
    selectors: ['["emergency"="ambulance_station"]', '["amenity"="ambulance_station"]'],
  },
  fire: {
    label: 'Fire brigade',
    selectors: ['["amenity"="fire_station"]'],
  },
  pharmacy: {
    label: 'Pharmacy / medicine shop',
    selectors: ['["amenity"="pharmacy"]', '["shop"="chemist"]', '["healthcare"="pharmacy"]'],
  },
  hospital: {
    label: 'Hospital / emergency clinic',
    selectors: [
      '["amenity"="hospital"]',
      '["healthcare"="hospital"]',
      '["amenity"="clinic"]["emergency"="yes"]',
    ],
  },
  blood_bank: {
    label: 'Blood bank',
    selectors: [
      '["healthcare"="blood_donation"]',
      '["healthcare"="blood_bank"]',
      '["amenity"="blood_bank"]',
    ],
  },
};

export const CATEGORY_KEYS = Object.keys(SOS_CATEGORIES);

export const DEFAULT_RADIUS_KM = 5;
export const MAX_RADIUS_KM = 25;
const MAX_RESULTS_PER_CATEGORY = 10;

const OVERPASS_ENDPOINTS = (
  process.env.OVERPASS_URLS ||
  'https://overpass-api.de/api/interpreter,https://overpass.kumi.systems/api/interpreter'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const NOMINATIM_URL = process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org/search';
const GEOCODE_COUNTRY_CODES = process.env.SOS_COUNTRY_CODES || 'in';
const OVERPASS_TIMEOUT_MS = 15_000;
const NOMINATIM_TIMEOUT_MS = 10_000;

// ── Small in-memory TTL cache ───────────────────────────────────────────────
// Public OSM servers are shared infrastructure with usage policies, and an
// emergency lookup is often repeated (retry, radius change, page refresh).
class TtlCache {
  constructor(ttlMs, maxEntries) {
    this.ttlMs = ttlMs;
    this.maxEntries = maxEntries;
    this.map = new Map();
  }

  get(key) {
    const hit = this.map.get(key);
    if (!hit) return undefined;
    if (hit.expires < Date.now()) {
      this.map.delete(key);
      return undefined;
    }
    return hit.value;
  }

  set(key, value) {
    if (this.map.size >= this.maxEntries) {
      this.map.delete(this.map.keys().next().value); // evict oldest
    }
    this.map.set(key, { value, expires: Date.now() + this.ttlMs });
  }

  clear() {
    this.map.clear();
  }
}

const placesCache = new TtlCache(5 * 60 * 1000, 200);
const geocodeCache = new TtlCache(24 * 60 * 60 * 1000, 500);

export const _clearCaches = () => {
  placesCache.clear();
  geocodeCache.clear();
};

// ── Geometry ────────────────────────────────────────────────────────────────
const toRad = (deg) => (deg * Math.PI) / 180;

/** Great-circle (straight-line) distance in metres. */
export function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371008.8;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

// ── OSM tag helpers ─────────────────────────────────────────────────────────
/** Which of our categories an OSM element belongs to (or null). */
export function categoryOf(tags = {}) {
  if (tags.amenity === 'police') return 'police';
  if (tags.amenity === 'fire_station') return 'fire';
  if (tags.emergency === 'ambulance_station' || tags.amenity === 'ambulance_station') return 'ambulance';
  if (
    tags.healthcare === 'blood_donation' ||
    tags.healthcare === 'blood_bank' ||
    tags.amenity === 'blood_bank'
  ) {
    return 'blood_bank';
  }
  if (tags.amenity === 'hospital' || tags.healthcare === 'hospital') return 'hospital';
  if (tags.amenity === 'clinic' && tags.emergency === 'yes') return 'hospital';
  if (tags.amenity === 'pharmacy' || tags.healthcare === 'pharmacy' || tags.shop === 'chemist') {
    return 'pharmacy';
  }
  return null;
}

/** Builds a readable one-line address from whatever addr:* tags exist. */
export function buildAddress(tags = {}) {
  if (tags['addr:full']) return tags['addr:full'];
  const street = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ');
  const parts = [
    tags['addr:housename'],
    street,
    tags['addr:suburb'] || tags['addr:neighbourhood'],
    tags['addr:city'] || tags['addr:town'] || tags['addr:village'] || tags['addr:district'],
    tags['addr:state'],
    tags['addr:postcode'],
  ].filter(Boolean);
  return parts.join(', ');
}

/**
 * Extracts dialable phone numbers. OSM stores several numbers in one tag
 * separated by ";" or ",", in free-form formatting. We keep only values that
 * reduce to a plausible dialable string, and expose a clean `tel` for the
 * tel: link plus the original `display` text.
 */
export function extractPhones(tags = {}) {
  const raw = [tags.phone, tags['contact:phone'], tags['contact:mobile'], tags.mobile, tags['phone:emergency']]
    .filter(Boolean)
    .join(';');

  const seen = new Set();
  const phones = [];
  for (const piece of raw.split(/[;,/]/)) {
    const display = piece.trim();
    if (!display) continue;
    const tel = display.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
    const digits = tel.replace(/\D/g, '');
    if (digits.length < 3 || digits.length > 15) continue;
    if (seen.has(tel)) continue;
    seen.add(tel);
    phones.push({ display, tel });
    if (phones.length === 3) break;
  }
  return phones;
}

const isOpenAllDay = (tags = {}) =>
  /^24\s*\/\s*7$/.test((tags.opening_hours || '').trim()) || tags.emergency === 'yes';

/** Converts a raw Overpass element into our API shape (or null if unusable). */
export function normalizeElement(el, origin) {
  const tags = el.tags || {};
  const category = categoryOf(tags);
  if (!category) return null;

  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;

  const distanceMeters = haversineMeters(origin.lat, origin.lng, lat, lng);

  return {
    id: `${el.type}/${el.id}`,
    category,
    categoryLabel: SOS_CATEGORIES[category].label,
    name: tags.name || tags['name:en'] || tags.operator || `Unnamed ${SOS_CATEGORIES[category].label.toLowerCase()}`,
    isNamed: Boolean(tags.name || tags['name:en'] || tags.operator),
    lat,
    lng,
    distanceMeters: Math.round(distanceMeters),
    distanceKm: Math.round(distanceMeters / 100) / 10,
    address: buildAddress(tags) || null,
    phones: extractPhones(tags),
    open24x7: isOpenAllDay(tags),
    openingHours: tags.opening_hours || null,
    website: tags.website || tags['contact:website'] || null,
  };
}

/**
 * Sorts by distance, drops near-duplicates (OSM often has both the building
 * way and a node for the same facility) and keeps the nearest N per category.
 */
export function rankAndTrim(services, perCategory = MAX_RESULTS_PER_CATEGORY) {
  const sorted = [...services].sort((a, b) => a.distanceMeters - b.distanceMeters);
  const kept = [];
  const counts = {};

  for (const s of sorted) {
    const normName = s.name.trim().toLowerCase();
    const duplicate = kept.some(
      (k) =>
        k.category === s.category &&
        k.name.trim().toLowerCase() === normName &&
        haversineMeters(k.lat, k.lng, s.lat, s.lng) < 100
    );
    if (duplicate) continue;
    if ((counts[s.category] || 0) >= perCategory) continue;
    counts[s.category] = (counts[s.category] || 0) + 1;
    kept.push(s);
  }
  return kept;
}

// ── Network helpers ─────────────────────────────────────────────────────────
async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function buildOverpassQuery({ lat, lng, radiusMeters, categories }) {
  const clauses = categories
    .flatMap((c) => SOS_CATEGORIES[c].selectors)
    .map((sel) => `  nwr(around:${radiusMeters},${lat},${lng})${sel};`)
    .join('\n');
  return `[out:json][timeout:12];\n(\n${clauses}\n);\nout center tags;`;
}

async function runOverpass(query) {
  let lastError;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetchWithTimeout(
        endpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': userAgent(),
            Accept: 'application/json',
          },
          body: new URLSearchParams({ data: query }).toString(),
        },
        OVERPASS_TIMEOUT_MS
      );
      if (!res.ok) throw new Error(`Overpass responded ${res.status}`);
      const json = await res.json();
      // Overpass can answer 200 with a partial result + a runtime-error remark.
      if (typeof json.remark === 'string' && /runtime error/i.test(json.remark)) {
        throw new Error(`Overpass: ${json.remark}`);
      }
      return json.elements || [];
    } catch (err) {
      lastError = err;
    }
  }
  console.error('SOS: all Overpass endpoints failed:', lastError?.message);
  throw new ApiError(
    502,
    'Could not load nearby services right now. Please call 112 for emergencies, or try again in a moment.'
  );
}

function userAgent() {
  const contact = process.env.SOS_CONTACT_EMAIL || process.env.CLIENT_URL || 'https://github.com/dvbuilds';
  return `PragatiAI-CivicPulse/1.0 (${contact})`;
}

// ── Public API ──────────────────────────────────────────────────────────────
/**
 * Finds emergency services around a point.
 * @returns {{ services: object[], counts: object, radiusKm: number }}
 */
export async function findNearbyServices({ lat, lng, radiusKm = DEFAULT_RADIUS_KM, categories = CATEGORY_KEYS }) {
  const cats = [...new Set(categories)].filter((c) => SOS_CATEGORIES[c]).sort();
  const radius = Math.min(Math.max(radiusKm, 0.5), MAX_RADIUS_KM);
  const radiusMeters = Math.round(radius * 1000);

  // ~110 m grid so repeat lookups from (nearly) the same spot share a cache entry.
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}|${radiusMeters}|${cats.join(',')}`;
  let elements = placesCache.get(cacheKey);
  if (!elements) {
    elements = await runOverpass(buildOverpassQuery({ lat, lng, radiusMeters, categories: cats }));
    placesCache.set(cacheKey, elements);
  }

  const origin = { lat, lng };
  const normalized = elements
    .map((el) => normalizeElement(el, origin))
    .filter((s) => s && cats.includes(s.category) && s.distanceMeters <= radiusMeters);

  const services = rankAndTrim(normalized);
  const counts = Object.fromEntries(cats.map((c) => [c, 0]));
  services.forEach((s) => {
    counts[s.category] += 1;
  });

  return { services, counts, radiusKm: radius };
}

const PIN_REGEX = /^[1-9]\d{5}$/;
export const isPinCode = (s) => PIN_REGEX.test(String(s).trim());

async function nominatimSearch(params) {
  const url = new URL(NOMINATIM_URL);
  const search = new URLSearchParams({
    format: 'jsonv2',
    limit: '5',
    addressdetails: '0',
    'accept-language': 'en',
    countrycodes: GEOCODE_COUNTRY_CODES,
    ...params,
  });
  if (process.env.SOS_CONTACT_EMAIL) search.set('email', process.env.SOS_CONTACT_EMAIL);
  url.search = search.toString();

  const res = await fetchWithTimeout(
    url,
    { headers: { 'User-Agent': userAgent(), Accept: 'application/json' } },
    NOMINATIM_TIMEOUT_MS
  );
  if (!res.ok) throw new Error(`Nominatim responded ${res.status}`);
  const rows = await res.json();
  return rows
    .map((r) => ({ label: r.display_name, lat: Number(r.lat), lng: Number(r.lon) }))
    .filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lng));
}

/**
 * Turns a 6-digit PIN code or a free-text place ("Salt Lake, Kolkata") into
 * candidate coordinates.
 */
export async function geocodeLocation(query) {
  const q = String(query).trim();
  const key = q.toLowerCase();
  const cached = geocodeCache.get(key);
  if (cached) return cached;

  let results;
  try {
    if (isPinCode(q)) {
      results = await nominatimSearch({ postalcode: q });
      // OSM postcode coverage is patchy; a plain-text query often still resolves.
      if (results.length === 0) results = await nominatimSearch({ q: `${q}, India` });
    } else {
      results = await nominatimSearch({ q });
    }
  } catch (err) {
    console.error('SOS: geocoding failed:', err.message);
    throw new ApiError(502, 'Location search is unavailable right now. Please try again, or use GPS.');
  }

  if (results.length > 0) geocodeCache.set(key, results);
  return results;
}
