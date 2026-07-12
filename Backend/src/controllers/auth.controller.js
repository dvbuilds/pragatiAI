import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

const generateTokens = async (userId) => {
  const user = await User.findById(userId).select('+password');
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  const user = await User.create({ fullName, email, password, phone });

  const { accessToken, refreshToken } = await generateTokens(user._id);
  const safeUser = await User.findById(user._id);

  res
    .status(201)
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(201, { user: safeUser, accessToken }, 'Account created successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const isValid = await user.isPasswordCorrect(password);
  if (!isValid) throw new ApiError(401, 'Invalid email or password');

  const { accessToken, refreshToken } = await generateTokens(user._id);
  const safeUser = await User.findById(user._id);

  res
    .status(200)
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(200, { user: safeUser, accessToken }, 'Logged in successfully'));
});

// Rotates the refresh token on every use: the incoming token is checked against
// the hash-equivalent stored on the user, then immediately replaced. This limits
// the blast radius if a refresh token is ever stolen (old one becomes useless).
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, 'Refresh token missing');

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, 'Refresh token expired or invalid, please log in again');
  }

  const user = await User.findById(decoded._id).select('+refreshToken');
  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, 'Refresh token is invalid or has already been used');
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  res
    .status(200)
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(200, { accessToken }, 'Access token refreshed'));
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'Logged out successfully'));
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, 'Current user fetched'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { age, gender, annualIncome, state, category, occupation, fullName, phone } = req.body;

  const update = {};
  if (fullName !== undefined) update.fullName = fullName;
  if (phone !== undefined) update.phone = phone;
  if (age !== undefined) update['profile.age'] = age;
  if (gender !== undefined) update['profile.gender'] = gender;
  if (annualIncome !== undefined) update['profile.annualIncome'] = annualIncome;
  if (state !== undefined) update['profile.state'] = state;
  if (category !== undefined) update['profile.category'] = category;
  if (occupation !== undefined) update['profile.occupation'] = occupation;

  const user = await User.findByIdAndUpdate(req.user._id, { $set: update }, { new: true, runValidators: true });
  res.status(200).json(new ApiResponse(200, user, 'Profile updated'));
});
