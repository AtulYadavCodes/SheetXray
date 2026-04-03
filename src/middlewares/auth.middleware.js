import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asynchandler.js';
import { StandardError } from '../utils/error_standard.js';

const authMiddleware = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new StandardError('Authorization token is missing', 401);
  }

  const token = header.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new StandardError('JWT_SECRET is not configured', 500);
  }

  req.user = jwt.verify(token, secret);
  next();
});

export default authMiddleware;