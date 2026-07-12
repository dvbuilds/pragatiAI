import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { matchSchemes } from '../services/ai.service.js';
import seedSchemes from '../data/schemes.js';
import User from '../models/User.js';

// Uses the profile saved on the user's account by default, but allows
// overriding fields in the request body for a one-off lookup.
export const getMatchedSchemes = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const profile = {
    age: req.body.age ?? user.profile?.age,
    gender: req.body.gender ?? user.profile?.gender,
    annualIncome: req.body.annualIncome ?? user.profile?.annualIncome,
    category: req.body.category ?? user.profile?.category,
    state: req.body.state ?? user.profile?.state,
    occupation: req.body.occupation ?? user.profile?.occupation,
  };

  const matches = await matchSchemes({ profile, seedSchemes });

  res.status(200).json(new ApiResponse(200, { profile, matches }, 'Matching schemes found'));
});

export const listAllSchemes = asyncHandler(async (_req, res) => {
  res.status(200).json(new ApiResponse(200, seedSchemes, 'All schemes'));
});
