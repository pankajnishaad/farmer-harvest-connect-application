const asyncHandler       = require('express-async-handler');
const ServiceListing     = require('../models/ServiceListing');
const BidOffer           = require('../models/BidOffer');
const HarvestRequirement = require('../models/HarvestRequirement');
const {
  success, created, notFound, badRequest, forbidden,
  getPagination, buildPaginationMeta, paginated,
} = require('../utils/response');

/* ═══════════════════════════════════════════════════════════════════════════
   SERVICE LISTINGS
═══════════════════════════════════════════════════════════════════════════ */

/** POST /api/provider/service */
const postService = asyncHandler(async (req, res) => {
  const data = { ...req.body, providerId: req.user._id };
  const svc  = await ServiceListing.create(data);
  return created(res, svc, 'Service posted successfully');
});

/** GET /api/provider/service/my */
const getMyServices = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { providerId: req.user._id };

  const [docs, total] = await Promise.all([
    ServiceListing.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ServiceListing.countDocuments(filter),
  ]);
  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/** PUT /api/provider/service/:id */
const updateService = asyncHandler(async (req, res) => {
  const svc = await ServiceListing.findOne({ _id: req.params.id, providerId: req.user._id });
  if (!svc) return notFound(res, 'Service not found');

  const allowed = [
    'vehicleDetails', 'manpowerDetails', 'pricePerDay',
    'availability', 'serviceArea', 'serviceType', 'isActive',
  ];
  allowed.forEach(k => { if (req.body[k] !== undefined) svc[k] = req.body[k]; });
  await svc.save();
  return success(res, svc, 'Service updated');
});

/** DELETE /api/provider/service/:id */
const deleteService = asyncHandler(async (req, res) => {
  const svc = await ServiceListing.findOne({ _id: req.params.id, providerId: req.user._id });
  if (!svc) return notFound(res, 'Service not found');
  await svc.deleteOne();
  return success(res, {}, 'Service deleted');
});

/* ═══════════════════════════════════════════════════════════════════════════
   FARMER REQUESTS (open harvest requirements)
═══════════════════════════════════════════════════════════════════════════ */

/** GET /api/provider/farmer-requests  — Browse open requirements (with filters) */
const getFarmerRequests = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { cropType, vehicleType, state, urgency } = req.query;

  const filter = { status: 'open' };
  if (cropType)    filter.cropType    = new RegExp(cropType, 'i');
  if (vehicleType) filter.vehicleType = vehicleType;
  if (urgency)     filter.urgency     = urgency;
  if (state)       filter['location.state'] = new RegExp(state, 'i');

  const [docs, total] = await Promise.all([
    HarvestRequirement.find(filter)
      .populate('farmerId', 'name phone profile.location')
      .sort({ urgency: 1, createdAt: -1 })   // immediate first
      .skip(skip)
      .limit(limit)
      .lean(),
    HarvestRequirement.countDocuments(filter),
  ]);
  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/* ═══════════════════════════════════════════════════════════════════════════
   BIDS
═══════════════════════════════════════════════════════════════════════════ */

/** POST /api/provider/bid */
const submitBid = asyncHandler(async (req, res) => {
  const { requirementId, serviceId, price, priceType, message } = req.body;

  const requirement = await HarvestRequirement.findById(requirementId);
  if (!requirement) return notFound(res, 'Harvest requirement not found');
  if (requirement.status !== 'open') return badRequest(res, 'This requirement is no longer accepting bids');

  // Check for duplicate bid
  const existing = await BidOffer.findOne({ providerId: req.user._id, requirementId });
  if (existing) return badRequest(res, 'You have already submitted a bid for this requirement');

  const bid = await BidOffer.create({
    providerId: req.user._id,
    farmerId:   requirement.farmerId,
    requirementId,
    serviceId,
    price,
    priceType,
    message,
  });

  return created(res, bid, 'Bid submitted successfully');
});

/** GET /api/provider/bids/my  — Provider's own bids */
const getMyBids = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { providerId: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const [docs, total] = await Promise.all([
    BidOffer.find(filter)
      .populate('farmerId',      'name phone profile')
      .populate('requirementId', 'cropType quantity location status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    BidOffer.countDocuments(filter),
  ]);
  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/** DELETE /api/provider/bids/:bidId  — Withdraw a pending bid */
const withdrawBid = asyncHandler(async (req, res) => {
  const bid = await BidOffer.findOne({ _id: req.params.bidId, providerId: req.user._id });
  if (!bid) return notFound(res, 'Bid not found');
  if (bid.status !== 'pending') return badRequest(res, `Cannot withdraw a bid that is ${bid.status}`);
  bid.status = 'withdrawn';
  await bid.save();
  return success(res, bid, 'Bid withdrawn');
});

/* ═══════════════════════════════════════════════════════════════════════════
   BOOKINGS (accepted bids = booking confirmations)
═══════════════════════════════════════════════════════════════════════════ */

/** GET /api/provider/bookings */
const getBookings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { providerId: req.user._id, status: { $in: ['accepted', 'completed'] } };

  const [docs, total] = await Promise.all([
    BidOffer.find(filter)
      .populate('farmerId',      'name phone profile')
      .populate('requirementId', 'cropType quantity location duration urgency')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    BidOffer.countDocuments(filter),
  ]);
  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/** PATCH /api/provider/bookings/:bidId/complete  — Mark as completed */
const completeBooking = asyncHandler(async (req, res) => {
  const bid = await BidOffer.findOne({
    _id:        req.params.bidId,
    providerId: req.user._id,
    status:     'accepted',
  });
  if (!bid) return notFound(res, 'Booking not found or already completed');
  bid.status = 'completed';
  await bid.save();
  await HarvestRequirement.findByIdAndUpdate(bid.requirementId, { status: 'completed' });
  return success(res, bid, 'Booking marked as completed');
});

module.exports = {
  postService, getMyServices, updateService, deleteService,
  getFarmerRequests,
  submitBid, getMyBids, withdrawBid,
  getBookings, completeBooking,
};
