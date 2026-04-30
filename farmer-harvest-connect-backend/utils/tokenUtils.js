const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for a given user document.
 * @param {Object} user - Mongoose user document
 * @returns {string} signed token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id:    user._id,
      email: user.email,
      role:  user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Verify a token and return the decoded payload.
 * Throws if invalid / expired.
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
