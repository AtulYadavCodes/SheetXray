import Pic from '../models/pic.model.js';
import asyncHandler from '../utils/asynchandler.js';
import { StandardError } from '../utils/error_standard.js';
import { sendSuccess } from '../utils/responsehandler.js';

export const getImages = asyncHandler(async (_req, res) => {
  const images = await Pic.find().populate('uploadedBy', 'name email').populate('group', 'name');
  return sendSuccess(res, 200, 'Images fetched successfully', images);
});

export const getImageById = asyncHandler(async (req, res) => {
  const image = await Pic.findById(req.params.id)
    .populate('uploadedBy', 'name email')
    .populate('group', 'name');

  if (!image) {
    throw new StandardError('Image not found', 404);
  }

  return sendSuccess(res, 200, 'Image fetched successfully', image);
});
