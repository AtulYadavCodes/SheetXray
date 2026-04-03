import User from '../models/user.model.js';
import asyncHandler from '../utils/asynchandler.js';
import { StandardError } from '../utils/error_standard.js';
import { sendSuccess } from '../utils/responsehandler.js';

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password');
  return sendSuccess(res, 200, 'Users fetched successfully', users);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    throw new StandardError('User not found', 404);
  }

  return sendSuccess(res, 200, 'User fetched successfully', user);
});
