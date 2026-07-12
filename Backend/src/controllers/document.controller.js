import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateDocumentGuide } from '../services/ai.service.js';
import { resolveOfficialLink } from '../data/documents.js';

export const getDocumentGuide = asyncHandler(async (req, res) => {
  const { documentName, action } = req.body;

  if (!documentName?.trim()) throw new ApiError(400, 'documentName is required');
  if (!['create', 'update'].includes(action)) throw new ApiError(400, 'action must be "create" or "update"');

  const officialLink = resolveOfficialLink(documentName);
  const guide = await generateDocumentGuide({ documentName, action, officialLink });

  res.status(200).json(new ApiResponse(200, guide, 'Document guide generated'));
});
