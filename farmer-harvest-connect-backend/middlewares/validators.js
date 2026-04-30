const { body, validationResult } = require('express-validator');
const { badRequest } = require('../utils/response');

/** Run after validation chains — aborts if errors found */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map(e => ({ field: e.path, message: e.msg }));
    return badRequest(res, 'Validation failed', formatted);
  }
  next();
};

/* ── Validation chains ──────────────────────────────────────────────────────── */

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['farmer', 'provider', 'buyer']).withMessage('Role must be farmer, provider, or buyer'),
  body('phone').optional().matches(/^[6-9]\d{9}$/).withMessage('Invalid Indian mobile number'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const harvestRequirementRules = [
  body('vehicleType').notEmpty().withMessage('Vehicle type is required'),
  body('cropType').notEmpty().withMessage('Crop type is required'),
  body('quantity.amount').isNumeric().withMessage('Quantity amount must be a number'),
  body('duration.value').isNumeric().withMessage('Duration value must be a number'),
  body('location.address').notEmpty().withMessage('Location address is required'),
];

const cropListingRules = [
  body('cropName').trim().notEmpty().withMessage('Crop name is required'),
  body('quantity.amount').isNumeric().withMessage('Quantity must be a number'),
  body('price.amount').isNumeric().withMessage('Price must be a number'),
  body('location.address').notEmpty().withMessage('Location is required'),
];

const serviceListingRules = [
  body('pricePerDay').isNumeric().withMessage('Price per day must be a number'),
  body('serviceType').isIn(['transport', 'manpower', 'harvester', 'cold-storage', 'both'])
    .withMessage('Invalid service type'),
];

const bidRules = [
  body('requirementId').isMongoId().withMessage('Invalid requirement ID'),
  body('price').isNumeric().withMessage('Bid price must be a number'),
];

const offerRules = [
  body('listingId').isMongoId().withMessage('Invalid listing ID'),
  body('offerPrice').isNumeric().withMessage('Offer price must be a number'),
  body('quantity.amount').isNumeric().withMessage('Quantity must be a number'),
];

const feedbackRules = [
  body('toUser').isMongoId().withMessage('Invalid user ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5'),
  body('comment').optional().isLength({ max: 1000 }).withMessage('Comment too long'),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  harvestRequirementRules,
  cropListingRules,
  serviceListingRules,
  bidRules,
  offerRules,
  feedbackRules,
};
