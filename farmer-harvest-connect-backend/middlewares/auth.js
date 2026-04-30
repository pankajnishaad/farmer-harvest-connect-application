const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../utils/tokenUtils');
const { unauthorized, forbidden } = require('../utils/response');
const User = require('../models/User');

/**
 * protect — Attaches req.user from valid JWT.
 * Must be applied before any role check.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return unauthorized(res, 'Access token is missing. Please log in.');
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Session expired. Please log in again.'
      : 'Invalid token. Please log in again.';
    return unauthorized(res, msg);
  }

  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    return unauthorized(res, 'User no longer exists.');
  }

  if (user.isBlocked) {
    return forbidden(res, 'Your account has been blocked. Contact support.');
  }

  req.user = user;
  next();
});

module.exports = { protect };
