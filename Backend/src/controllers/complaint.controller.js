import Complaint from '../models/Complaint.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateComplaintEmail } from '../services/ai.service.js';
import { sendMail } from '../services/email.service.js';

// Default recipients per issue category. In production these would come from a
// verified directory of local authority contacts, keyed by area/state.
const DEFAULT_RECIPIENTS = {
  waterlogging: 'grievance.publicworks@example.gov.in',
  inefficient_service: 'grievance.admin@example.gov.in',
  crime_rate: 'grievance.police@example.gov.in',
};

export const draftComplaint = asyncHandler(async (req, res) => {
  const { issueCategory, area, details } = req.body;

  if (!['waterlogging', 'inefficient_service', 'crime_rate'].includes(issueCategory)) {
    throw new ApiError(400, 'issueCategory must be one of waterlogging, inefficient_service, crime_rate');
  }
  if (!area?.trim() || !details?.trim()) {
    throw new ApiError(400, 'area and details are required');
  }

  const draft = await generateComplaintEmail({
    issueCategory,
    area,
    details,
    citizenName: req.user.fullName,
  });

  const complaint = await Complaint.create({
    submittedBy: req.user._id,
    issueCategory,
    area,
    details,
    generatedSubject: draft.subject,
    generatedBody: draft.body,
    status: 'drafted',
  });

  res.status(201).json(new ApiResponse(201, complaint, 'Complaint email drafted'));
});

export const sendComplaint = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { recipientEmail } = req.body;

  const complaint = await Complaint.findOne({ _id: id, submittedBy: req.user._id });
  if (!complaint) throw new ApiError(404, 'Complaint draft not found');

  const to = recipientEmail || DEFAULT_RECIPIENTS[complaint.issueCategory];

  try {
    await sendMail({ to, subject: complaint.generatedSubject, text: complaint.generatedBody });
    complaint.status = 'sent';
    complaint.recipientEmail = to;
    complaint.sentAt = new Date();
    await complaint.save();
  } catch (err) {
    complaint.status = 'failed';
    await complaint.save();
    throw new ApiError(502, `Failed to send complaint email: ${err.message}`);
  }

  res.status(200).json(new ApiResponse(200, complaint, 'Complaint email sent'));
});

export const listMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ submittedBy: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, complaints, 'Complaints fetched'));
});
