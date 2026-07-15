import Issue from '../models/Issue.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { categorizeIssue } from '../services/ai.service.js';

export const createIssue = asyncHandler(async (req, res) => {
  const { description, lat, lng, address } = req.body;

  if (!description?.trim()) throw new ApiError(400, 'A description of the issue is required');
  if (lat === undefined || lng === undefined) throw new ApiError(400, 'Location (lat, lng) is required');

  // AI categorization happens server-side now (real Gemini call, not the mock
  // setTimeout from the frontend prototype), so results can't be spoofed by the client.
  const analysis = await categorizeIssue(description);

  let photo = { url: null, publicId: null };
  if (req.file?.path) {
    const uploaded = await uploadToCloudinary(req.file.path);
    if (uploaded) photo = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }

  const issue = await Issue.create({
    reportedBy: req.user._id,
    description,
    type: analysis.category,
    department: analysis.department,
    priority: analysis.priority,
    photo,
    location: {
      type: 'Point',
      coordinates: [Number(lng), Number(lat)],
      address: address || '',
    },
    aiAnalysis: {
      category: analysis.category,
      confidence: analysis.confidence,
      rawReasoning: analysis.reasoning,
    },
  });

  res.status(201).json(new ApiResponse(201, issue, 'Issue reported and dispatched'));
});

export const listIssues = asyncHandler(async (req, res) => {
  const { status, type, near, radiusKm, mine } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (mine === 'true') filter.reportedBy = req.user._id;

  if (near) {
    const [lng, lat] = near.split(',').map(Number);
    filter.location = {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: (Number(radiusKm) || 5) * 1000,
      },
    };
  }

  const issues = await Issue.find(filter).sort({ createdAt: -1 }).limit(200).populate('reportedBy', 'fullName');
  res.status(200).json(new ApiResponse(200, issues, 'Issues fetched'));
});

export const getIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate('reportedBy', 'fullName');
  if (!issue) throw new ApiError(404, 'Issue not found');
  res.status(200).json(new ApiResponse(200, issue, 'Issue fetched'));
});

// Powers the Public Portal's "Recently Resolved" feed and the "Issues
// Fixed This Week" badge — both used to be hardcoded on the frontend.
export const getPortalStats = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [resolvedThisWeek, recentlyResolved] = await Promise.all([
    Issue.countDocuments({ status: 'resolved', updatedAt: { $gte: sevenDaysAgo } }),
    Issue.find({ status: 'resolved' }).sort({ updatedAt: -1 }).limit(5),
  ]);

  res.status(200).json(
    new ApiResponse(200, { resolvedThisWeek, recentlyResolved }, 'Portal stats fetched')
  );
});

export const updateIssueStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['active', 'in_review', 'resolved'].includes(status)) {
    throw new ApiError(400, 'Invalid status value');
  }

  const issue = await Issue.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!issue) throw new ApiError(404, 'Issue not found');

  res.status(200).json(new ApiResponse(200, issue, 'Issue status updated'));
});
