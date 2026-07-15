import api from './api';

/**
 * Fetches issues from the backend, optionally scoped to a radius around a
 * lat/lng point. Mirrors the query params supported by
 * Backend/src/controllers/issue.controller.js#listIssues.
 *
 * @param {Object} params
 * @param {{lat:number,lng:number}=} params.near - center point for a geospatial query
 * @param {number=} params.radiusKm - search radius in km (default 5 on the backend)
 * @param {string=} params.status - 'active' | 'in_review' | 'resolved'
 * @param {string=} params.type - 'pothole' | 'lighting' | 'sanitation' | 'noise' | 'other'
 */
export async function fetchIssues({ near, radiusKm, status, type } = {}) {
  const params = {};
  if (near) params.near = `${near.lng},${near.lat}`;
  if (radiusKm) params.radiusKm = radiusKm;
  if (status) params.status = status;
  if (type) params.type = type;

  const { data } = await api.get('/issues', { params });
  return data?.data ?? [];
}

/** Human-friendly labels used both for map pins and the detail panel. */
export const ISSUE_TYPE_LABELS = {
  pothole: 'Pothole Report',
  lighting: 'Streetlight Issue',
  sanitation: 'Sanitation Report',
  noise: 'Noise Complaint',
  other: 'Civic Report',
};

export function getIssueTitle(issue) {
  return ISSUE_TYPE_LABELS[issue.type] || 'Civic Report';
}

/** Turns a Mongo createdAt timestamp into "3 hours ago" style text. */
export function timeAgo(dateString) {
  if (!dateString) return '';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(dateString).toLocaleDateString();
}

/** Normalizes a backend Issue document's GeoJSON [lng,lat] into {lat,lng}. */
export function toLatLng(issue) {
  const coords = issue?.location?.coordinates;
  if (!Array.isArray(coords) || coords.length !== 2) return null;
  const [lng, lat] = coords;
  if (typeof lat !== 'number' || typeof lng !== 'number' || (lat === 0 && lng === 0)) return null;
  return { lat, lng };
}
