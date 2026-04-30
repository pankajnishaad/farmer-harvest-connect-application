const logger = require('../utils/logger');

/**
 * Central error handler — must be registered LAST in Express middleware stack.
 * Catches anything passed via next(err).
 */
const errorHandler = (err, req, res, _next) => {
  logger.error(`${req.method} ${req.originalUrl} → ${err.message}`, { stack: err.stack });

  /* ── Mongoose validation error ────────────────────────────────────────────── */
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field:   e.path,
      message: e.message,
    }));
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  /* ── Mongoose duplicate key ───────────────────────────────────────────────── */
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `Duplicate value: a record with this ${field} already exists.`,
    });
  }

  /* ── Mongoose bad ObjectId ────────────────────────────────────────────────── */
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ success: false, message: `Invalid ID format: ${err.value}` });
  }

  /* ── JWT errors ───────────────────────────────────────────────────────────── */
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  /* ── Multer errors ────────────────────────────────────────────────────────── */
  if (err.code === 'LIMIT_FILE_SIZE') {
    const mb = parseFloat(process.env.MAX_FILE_SIZE_MB || 5);
    return res.status(400).json({ success: false, message: `File too large. Max ${mb} MB allowed.` });
  }

  /* ── Operational errors with a known status code ──────────────────────────── */
  const status = err.statusCode || err.status || 500;
  const message = (status < 500 || process.env.NODE_ENV !== 'production')
    ? err.message
    : 'Internal server error';

  res.status(status).json({ success: false, message });
};

/** Simple 404 for undefined routes */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

module.exports = { errorHandler, notFoundHandler };
