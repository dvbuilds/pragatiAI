import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  haversineMeters,
  categoryOf,
  buildAddress,
  extractPhones,
  normalizeElement,
  rankAndTrim,
  buildOverpassQuery,
  findNearbyServices,
  geocodeLocation,
  isPinCode,
  _clearCaches,
} from '../src/services/sos.service.js';

const ORIGIN = { lat: 22.5726, lng: 88.3639 }; // Kolkata

const node = (id, lat, lng, tags) => ({ type: 'node', id, lat, lon: lng, tags });

describe('geometry', () => {
  test('haversine: zero for same point, ~111km per degree of latitude', () => {
    assert.equal(Math.round(haversineMeters(10, 20, 10, 20)), 0);
    const d = haversineMeters(0, 0, 1, 0);
    assert.ok(d > 111_000 && d < 111_400, `got ${d}`);
  });
});

describe('tag helpers', () => {
  test('categoryOf maps OSM tags to categories', () => {
    assert.equal(categoryOf({ amenity: 'police' }), 'police');
    assert.equal(categoryOf({ amenity: 'fire_station' }), 'fire');
    assert.equal(categoryOf({ emergency: 'ambulance_station' }), 'ambulance');
    assert.equal(categoryOf({ amenity: 'pharmacy' }), 'pharmacy');
    assert.equal(categoryOf({ shop: 'chemist' }), 'pharmacy');
    assert.equal(categoryOf({ amenity: 'hospital' }), 'hospital');
    assert.equal(categoryOf({ amenity: 'clinic', emergency: 'yes' }), 'hospital');
    assert.equal(categoryOf({ healthcare: 'blood_donation' }), 'blood_bank');
    assert.equal(categoryOf({ amenity: 'clinic' }), null, 'a plain clinic is not an emergency clinic');
    assert.equal(categoryOf({ amenity: 'cafe' }), null);
  });

  test('a hospital that also has a blood-bank tag is treated as a blood bank only when tagged so', () => {
    assert.equal(categoryOf({ amenity: 'hospital', healthcare: 'blood_bank' }), 'blood_bank');
  });

  test('buildAddress joins available parts and tolerates none', () => {
    assert.equal(
      buildAddress({ 'addr:housenumber': '12', 'addr:street': 'AJC Bose Rd', 'addr:city': 'Kolkata', 'addr:postcode': '700020' }),
      '12 AJC Bose Rd, Kolkata, 700020'
    );
    assert.equal(buildAddress({}), '');
    assert.equal(buildAddress({ 'addr:full': 'Full Addr' }), 'Full Addr');
  });

  test('extractPhones splits, cleans, dedupes and rejects junk', () => {
    const phones = extractPhones({
      phone: '+91 33 2223 1234; +91-33-2223-1234',
      'contact:mobile': '98300 12345, call us',
    });
    assert.deepEqual(phones.map((p) => p.tel), ['+913322231234', '9830012345']);
    assert.equal(phones[0].display, '+91 33 2223 1234');
    assert.deepEqual(extractPhones({ phone: 'n/a' }), []);
    assert.deepEqual(extractPhones({ phone: '12' }), []);
    assert.deepEqual(extractPhones({}), []);
  });

  test('isPinCode accepts 6-digit Indian PINs only', () => {
    assert.ok(isPinCode('700091'));
    assert.ok(!isPinCode('070091'));
    assert.ok(!isPinCode('7000912'));
    assert.ok(!isPinCode('Salt Lake'));
  });
});

describe('normalize + rank', () => {
  test('normalizeElement computes distance, handles way centers, drops unusable', () => {
    const n = normalizeElement(node(1, 22.5826, 88.3639, { amenity: 'police', name: 'Park Street PS', phone: '100' }), ORIGIN);
    assert.equal(n.category, 'police');
    assert.equal(n.id, 'node/1');
    assert.ok(n.distanceMeters > 1000 && n.distanceMeters < 1200);
    assert.equal(n.phones[0].tel, '100');

    const way = normalizeElement(
      { type: 'way', id: 9, center: { lat: 22.58, lon: 88.37 }, tags: { amenity: 'hospital', name: 'H', opening_hours: '24/7' } },
      ORIGIN
    );
    assert.equal(way.open24x7, true);
    assert.ok(Number.isFinite(way.lat));

    assert.equal(normalizeElement({ type: 'node', id: 2, tags: { amenity: 'police' } }, ORIGIN), null, 'no coords');
    assert.equal(normalizeElement(node(3, 1, 1, { amenity: 'cafe' }), ORIGIN), null, 'not a category');
  });

  test('unnamed facilities get a readable fallback name', () => {
    const n = normalizeElement(node(4, 22.573, 88.364, { amenity: 'pharmacy' }), ORIGIN);
    assert.match(n.name, /^Unnamed pharmacy/i);
    assert.equal(n.isNamed, false);
  });

  test('rankAndTrim sorts by distance, dedupes node+way twins, caps per category', () => {
    const mk = (id, name, lat, lng, category = 'pharmacy') => ({
      id, name, category, lat, lng,
      distanceMeters: Math.round(haversineMeters(ORIGIN.lat, ORIGIN.lng, lat, lng)),
    });
    const list = [
      mk('c', 'Far', 22.60, 88.40),
      mk('a', 'Twin', 22.5730, 88.3640),
      mk('b', 'Twin', 22.57302, 88.36402), // same facility, ~3 m away
      mk('d', 'Other category', 22.5731, 88.3641, 'police'),
    ];
    const out = rankAndTrim(list, 10);
    assert.deepEqual(out.map((s) => s.id), ['a', 'd', 'c']);

    const many = Array.from({ length: 15 }, (_, i) => mk(`m${i}`, `P${i}`, 22.58 + i * 0.001, 88.37));
    assert.equal(rankAndTrim(many, 10).length, 10);
  });
});

describe('overpass query', () => {
  test('includes only the requested categories and the radius', () => {
    const q = buildOverpassQuery({ lat: 22.5, lng: 88.3, radiusMeters: 5000, categories: ['fire'] });
    assert.match(q, /nwr\(around:5000,22\.5,88\.3\)\["amenity"="fire_station"\]/);
    assert.doesNotMatch(q, /police/);
    assert.match(q, /out center tags;/);
  });
});

describe('network paths (fetch mocked)', () => {
  const realFetch = globalThis.fetch;
  let calls;

  beforeEach(() => {
    _clearCaches();
    calls = [];
  });
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  const jsonResponse = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

  test('findNearbyServices returns sorted, radius-limited results and caches', async () => {
    globalThis.fetch = async (url, opts) => {
      calls.push(String(url));
      return jsonResponse({
        elements: [
          node(1, 22.60, 88.3639, { amenity: 'hospital', name: 'Far Hospital' }),            // ~3.1 km
          node(2, 22.5736, 88.3639, { amenity: 'police', name: 'Near PS', phone: '+91 33 1111 2222' }), // ~110 m
          node(3, 22.70, 88.3639, { amenity: 'fire_station', name: 'Out of radius' }),         // ~14 km
        ],
      });
    };
    const r = await findNearbyServices({ lat: ORIGIN.lat, lng: ORIGIN.lng, radiusKm: 5 });
    assert.deepEqual(r.services.map((s) => s.name), ['Near PS', 'Far Hospital']);
    assert.equal(r.counts.police, 1);
    assert.equal(r.counts.fire, 0);
    assert.equal(calls.length, 1);

    await findNearbyServices({ lat: ORIGIN.lat, lng: ORIGIN.lng, radiusKm: 5 });
    assert.equal(calls.length, 1, 'second identical lookup is served from cache');
  });

  test('falls back to the second Overpass mirror when the first fails', async () => {
    globalThis.fetch = async (url) => {
      calls.push(String(url));
      if (calls.length === 1) return jsonResponse({}, 504);
      return jsonResponse({ elements: [node(1, 22.5730, 88.3639, { amenity: 'police', name: 'PS' })] });
    };
    const r = await findNearbyServices({ lat: ORIGIN.lat, lng: ORIGIN.lng, categories: ['police'] });
    assert.equal(r.services.length, 1);
    assert.equal(calls.length, 2);
    assert.notEqual(calls[0], calls[1]);
  });

  test('throws a 502 ApiError when every mirror fails', async () => {
    globalThis.fetch = async () => jsonResponse({}, 429);
    await assert.rejects(
      () => findNearbyServices({ lat: ORIGIN.lat, lng: ORIGIN.lng }),
      (err) => err.statusCode === 502 && /112/.test(err.message)
    );
  });

  test('treats an Overpass runtime-error remark as a failure', async () => {
    globalThis.fetch = async () => jsonResponse({ elements: [], remark: 'runtime error: Query timed out' });
    await assert.rejects(() => findNearbyServices({ lat: 1, lng: 1 }), (e) => e.statusCode === 502);
  });

  test('geocodeLocation: PIN uses postalcode first then plain-text fallback; caches hits', async () => {
    globalThis.fetch = async (url) => {
      const u = new URL(String(url));
      calls.push(u.search);
      if (u.searchParams.get('postalcode')) return jsonResponse([]);
      return jsonResponse([{ display_name: 'Salt Lake, Kolkata', lat: '22.58', lon: '88.41' }]);
    };
    const r = await geocodeLocation('700091');
    assert.deepEqual(r, [{ label: 'Salt Lake, Kolkata', lat: 22.58, lng: 88.41 }]);
    assert.equal(calls.length, 2);
    assert.match(calls[0], /postalcode=700091/);
    assert.match(calls[1], /q=700091%2C\+India/);

    await geocodeLocation('700091');
    assert.equal(calls.length, 2, 'cached');
  });

  test('geocodeLocation: upstream failure becomes a 502', async () => {
    globalThis.fetch = async () => { throw new Error('network down'); };
    await assert.rejects(() => geocodeLocation('Howrah'), (e) => e.statusCode === 502);
  });
});

describe('HTTP routes', () => {
  const realFetch = globalThis.fetch;
  let server;
  let base;

  beforeEach(async () => {
    _clearCaches();
    process.env.NODE_ENV = 'test';
    // ai.service.js builds its LLM client at import time and needs *a* key;
    // the SOS routes never call it, so a dummy value is enough to load the app.
    process.env.OPENAI_API_KEY ||= 'test-key';
    process.env.GROQ_API_KEY ||= 'test-key';
    const { default: app } = await import('../src/app.js');
    await new Promise((resolve) => {
      server = app.listen(0, resolve);
    });
    base = `http://127.0.0.1:${server.address().port}/api/v1/sos`;
  });
  afterEach(async () => {
    globalThis.fetch = realFetch;
    await new Promise((resolve) => server.close(resolve));
  });

  // Route the app's own calls to the real fetch, and OSM calls to a stub.
  const stubOsm = (handler) => {
    globalThis.fetch = (url, opts) =>
      String(url).startsWith('http://127.0.0.1') ? realFetch(url, opts) : handler(url, opts);
  };

  test('GET /nearby validates input (422) without needing a login', async () => {
    const res = await realFetch(`${base}/nearby?lat=abc&lng=88`);
    assert.equal(res.status, 422);
    const bad = await realFetch(`${base}/nearby?lat=22&lng=88&categories=zoo`);
    assert.equal(bad.status, 422);
    const far = await realFetch(`${base}/nearby?lat=22&lng=88&radiusKm=500`);
    assert.equal(far.status, 422);
  });

  test('GET /nearby returns services in the ApiResponse envelope', async () => {
    stubOsm(async () =>
      new Response(JSON.stringify({ elements: [node(1, 22.5736, 88.3639, { amenity: 'police', name: 'Near PS', phone: '100' })] }), { status: 200 })
    );
    const res = await realFetch(`${base}/nearby?lat=22.5726&lng=88.3639&radiusKm=3&categories=police`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.services[0].name, 'Near PS');
    assert.equal(body.data.radiusKm, 3);
    assert.match(body.data.source, /OpenStreetMap/);
  });

  test('GET /geocode: 422 on short query, 404 when nothing found, 200 on hit', async () => {
    assert.equal((await realFetch(`${base}/geocode?q=ab`)).status, 422);

    stubOsm(async () => new Response('[]', { status: 200 }));
    assert.equal((await realFetch(`${base}/geocode?q=Nowhereville`)).status, 404);

    stubOsm(async () => new Response(JSON.stringify([{ display_name: 'Howrah', lat: '22.59', lon: '88.31' }]), { status: 200 }));
    const ok = await realFetch(`${base}/geocode?q=Howrah+Station`);
    assert.equal(ok.status, 200);
    assert.equal((await ok.json()).data.results[0].label, 'Howrah');
  });
});
