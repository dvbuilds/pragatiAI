import api from './api';

/**
 * Thin client for the backend's /sos endpoints. Both are public (no login
 * needed) and read-only; they list services, they never dispatch anything.
 */

/** @returns {Promise<{ services: object[], counts: object, radiusKm: number }>} */
export async function fetchNearbyServices({ lat, lng, radiusKm }, signal) {
  const { data } = await api.get('/sos/nearby', {
    params: { lat: lat.toFixed(5), lng: lng.toFixed(5), radiusKm },
    signal,
  });
  return data.data;
}

/** @returns {Promise<{ label: string, lat: number, lng: number }[]>} */
export async function geocodePlace(q, signal) {
  const { data } = await api.get('/sos/geocode', { params: { q }, signal });
  return data.data.results;
}

/** Best human-readable message from an axios error. */
export function sosErrorMessage(err, fallback) {
  return err?.response?.data?.message || fallback;
}
