/**
 * Static emergency data + small helpers for the SOS feature.
 *
 * The numbers below are national Indian helplines taken from the Government of
 * India helpline directory (india.gov.in/directory/helpline). They are
 * hard-coded on purpose: they must be on screen and dialable even when the
 * network request for nearby services fails.
 *
 * Other numbers that are common but NOT nationwide (e.g. 108 ambulance, which
 * is operated per-state) are deliberately left out so we never show a number
 * that doesn't work everywhere.
 */

// Text for these lives in i18n/locales/*/sos.js; only numbers and keys are here.
export const PRIMARY_EMERGENCY = {
  number: '112',
};

export const EMERGENCY_NUMBERS = [
  { number: '100', labelKey: 'sos.numbers.police' },
  { number: '101', labelKey: 'sos.numbers.fire' },
  { number: '102', labelKey: 'sos.numbers.ambulance' },
  { number: '181', labelKey: 'sos.numbers.women' },
  { number: '1098', labelKey: 'sos.numbers.child' },
];

// Category metadata shared by the filter chips, the list and the map pins.
// Keys must match the backend's SOS_CATEGORIES.
export const SOS_CATEGORIES = [
  { key: 'police', labelKey: 'sos.category.police', color: '#1d4ed8', glyph: 'P' },
  { key: 'ambulance', labelKey: 'sos.category.ambulance', color: '#dc2626', glyph: 'A' },
  { key: 'fire', labelKey: 'sos.category.fire', color: '#ea580c', glyph: 'F' },
  { key: 'hospital', labelKey: 'sos.category.hospital', color: '#be123c', glyph: 'H' },
  { key: 'pharmacy', labelKey: 'sos.category.pharmacy', color: '#059669', glyph: 'Rx' },
  { key: 'blood_bank', labelKey: 'sos.category.blood_bank', color: '#9f1239', glyph: 'B' },
];

export const CATEGORY_BY_KEY = Object.fromEntries(SOS_CATEGORIES.map((c) => [c.key, c]));

export const RADIUS_OPTIONS_KM = [2, 5, 10, 25];
export const DEFAULT_RADIUS_KM = 5;

/** tel: link. Keeps digits and a leading "+" only. */
export const telHref = (number) => `tel:${String(number).replace(/[^\d+]/g, '')}`;

/** Turn-by-turn directions in Google Maps (opens the app on phones). */
export const googleMapsDirectionsUrl = (lat, lng) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

/** "850 m" under 1 km, otherwise "1.2 km". Straight-line distance. */
export function formatDistance(meters) {
  if (!Number.isFinite(meters)) return '';
  if (meters < 1000) return `${Math.round(meters / 10) * 10 || 10} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}
