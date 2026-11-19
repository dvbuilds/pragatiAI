import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import {
  CATEGORY_KEYS,
  DEFAULT_RADIUS_KM,
  findNearbyServices,
  geocodeLocation,
} from '../services/sos.service.js';

// GET /sos/nearby?lat=&lng=&radiusKm=&categories=police,fire
// Finds emergency services near a point. It only *lists* services — nothing
// is dispatched.
export const getNearbyServices = asyncHandler(async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radiusKm = req.query.radiusKm ? Number(req.query.radiusKm) : DEFAULT_RADIUS_KM;
  const categories = req.query.categories
    ? String(req.query.categories).split(',').map((c) => c.trim()).filter(Boolean)
    : CATEGORY_KEYS;

  const { services, counts, radiusKm: usedRadius } = await findNearbyServices({
    lat,
    lng,
    radiusKm,
    categories,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        origin: { lat, lng },
        radiusKm: usedRadius,
        counts,
        services,
        source: 'OpenStreetMap contributors',
        fetchedAt: new Date().toISOString(),
      },
      services.length ? 'Nearby emergency services found' : 'No listed services in this radius'
    )
  );
});

// GET /sos/geocode?q=700091  (or an area name)
// Manual-location fallback for when GPS is denied or unavailable.
export const geocode = asyncHandler(async (req, res) => {
  const results = await geocodeLocation(req.query.q);
  if (results.length === 0) {
    throw new ApiError(404, 'We could not find that location. Check the PIN code or try a nearby area name.');
  }
  res.status(200).json(new ApiResponse(200, { results }, 'Location found'));
});
