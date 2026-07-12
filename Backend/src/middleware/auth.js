import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

export const verifyJWT = asyncHandler(async (req, _res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized request: no access token provided');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, err.name === 'TokenExpiredError' ? 'Access token expired' : 'Invalid access token');
  }

  const user = await User.findById(decoded._id).select('-password -refreshToken');
  if (!user) {
    throw new ApiError(401, 'Invalid access token: user no longer exists');
  }

  req.user = user;
  next();
});

// Restricts a route to specific roles, e.g. requireRole('admin')
export const requireRole = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, 'You do not have permission to perform this action');
  }
  next();
};
