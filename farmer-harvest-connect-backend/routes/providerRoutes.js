const express = require('express');
const router  = express.Router();

const {
  postService, getMyServices, updateService, deleteService,
  getFarmerRequests,
  submitBid, getMyBids, withdrawBid,
  getBookings, completeBooking,
} = require('../controllers/providerController');

const { protect }   = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const { serviceListingRules, bidRules, validate } = require('../middlewares/validators');

router.use(protect, authorize('provider'));

/* ── Services ──────────────────────────────────────────────────────────── */
router.post('/service',       serviceListingRules, validate, postService);
router.get('/service/my',     getMyServices);
router.put('/service/:id',    updateService);
router.delete('/service/:id', deleteService);

/* ── Farmer Requirements (read) ────────────────────────────────────────── */
router.get('/farmer-requests', getFarmerRequests);

/* ── Bids ──────────────────────────────────────────────────────────────── */
router.post('/bid',             bidRules, validate, submitBid);
router.get('/bids/my',          getMyBids);
router.delete('/bids/:bidId',   withdrawBid);

/* ── Bookings ──────────────────────────────────────────────────────────── */
router.get('/bookings',                   getBookings);
router.patch('/bookings/:bidId/complete', completeBooking);

module.exports = router;
