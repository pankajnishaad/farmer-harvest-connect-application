const { forbidden } = require('../utils/response');

/**
 * authorize(...roles)
 * Usage:  router.get('/route', protect, authorize('admin', 'farmer'), handler)
 * Must be called AFTER protect middleware.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return forbidden(res, 'Not authenticated');
    }
    if (!roles.includes(req.user.role)) {
      return forbidden(
        res,
        `Role '${req.user.role}' is not authorized to access this route. Required: ${roles.join(' or ')}.`
      );
    }
    next();
  };
};

module.exports = { authorize };
