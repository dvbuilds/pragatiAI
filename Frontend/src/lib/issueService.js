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
 * @param {boolean=} params.mine - only issues reported by the logged-in user
 */
export async function fetchIssues({ near, radiusKm, status, type, mine } = {}) {
  const params = {};
  if (near) params.near = `${near.lng},${near.lat}`;
  if (radiusKm) params.radiusKm = radiusKm;
  if (status) params.status = status;
  if (type) params.type = type;
  if (mine) params.mine = 'true';

  const { data } = await api.get('/issues', { params });
  return data?.data ?? [];
}

/**
 * Submits a new civic issue report to the backend. The server does the
 * real AI categorization (Groq) and geocoding is already resolved
 * client-side via the Leaflet location picker before this is called.
 *
 * @param {Object} params
 * @param {string} params.description
 * @param {number} params.lat
 * @param {number} params.lng
 * @param {string=} params.address
 * @param {File=} params.photo
 */
export async function createIssue({ description, lat, lng, address, photo }) {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('lat', lat);
  formData.append('lng', lng);
  if (address) formData.append('address', address);
  if (photo) formData.append('photo', photo);

  // Let the browser set the multipart boundary itself — the shared axios
  // instance defaults to 'application/json', so that has to be cleared here.
  const { data } = await api.post('/issues', formData, {
    headers: { 'Content-Type': undefined },
  });
  return data?.data;
}

/**
 * Real stats for the Public Portal — resolved-this-week count and the
 * most recently resolved issues, replacing what used to be hardcoded.
 */
export async function fetchPortalStats() {
  const { data } = await api.get('/issues/stats');
  return data?.data ?? { resolvedThisWeek: 0, recentlyResolved: [] };
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

/** Human-friendly label + Tailwind classes for a real backend issue status. */
export const ISSUE_STATUS_META = {
  active: { label: 'Active', className: 'bg-[#b9c7e0]/30 text-[#0d1c2f]' },
  in_review: { label: 'In Review', className: 'bg-amber-50 text-amber-700 border border-amber-100' },
  resolved: { label: 'Resolved', className: 'bg-emerald-50 text-emerald-700' },
};

export function getStatusMeta(status) {
  return ISSUE_STATUS_META[status] || ISSUE_STATUS_META.active;
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