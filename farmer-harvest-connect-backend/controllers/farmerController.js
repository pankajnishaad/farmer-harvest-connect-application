const asyncHandler        = require('express-async-handler');
const HarvestRequirement  = require('../models/HarvestRequirement');
const BidOffer            = require('../models/BidOffer');
const CropListing         = require('../models/CropListing');
const CropOffer           = require('../models/CropOffer');
const {
  success, created, notFound, badRequest, forbidden,
  getPagination, buildPaginationMeta, paginated,
} = require('../utils/response');
const path = require('path');

/* ═══════════════════════════════════════════════════════════════════════════
   HARVEST REQUIREMENTS
═══════════════════════════════════════════════════════════════════════════ */

/** POST /api/farmer/requirements  — Create a harvest requirement */
const postRequirement = asyncHandler(async (req, res) => {
  const data = { ...req.body, farmerId: req.user._id };
  const req_ = await HarvestRequirement.create(data);
  return created(res, req_, 'Harvest requirement posted successfully');
});

/** GET /api/farmer/requirements/my  — My requirements + pagination */
const getMyRequirements = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { farmerId: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const [docs, total] = await Promise.all([
    HarvestRequirement.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    HarvestRequirement.countDocuments(filter),
  ]);
  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/** PATCH /api/farmer/requirements/:id  — Update status (cancel) */
const updateRequirement = asyncHandler(async (req, res) => {
  const req_ = await HarvestRequirement.findOne({ _id: req.params.id, farmerId: req.user._id });
  if (!req_) return notFound(res, 'Requirement not found');
  if (req_.status === 'completed') return badRequest(res, 'Cannot edit a completed requirement');

  Object.assign(req_, req.body);
  await req_.save();
  return success(res, req_, 'Requirement updated');
});

/* ═══════════════════════════════════════════════════════════════════════════
   BIDS / OFFERS ON REQUIREMENTS
═══════════════════════════════════════════════════════════════════════════ */

/** GET /api/farmer/offers  — All bids on my requirements */
const getMyOffers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  // Find requirements belonging to this farmer
  const reqIds = await HarvestRequirement.find({ farmerId: req.user._id }).distinct('_id');

  const filter = { requirementId: { $in: reqIds } };
  if (req.query.status) filter.status = req.query.status;

  const [docs, total] = await Promise.all([
    BidOffer.find(filter)
      .populate('providerId', 'name email phone profile')
      .populate('requirementId', 'cropType quantity location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    BidOffer.countDocuments(filter),
  ]);
  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/** PATCH /api/farmer/offers/:bidId  — Accept or reject a bid */
const respondToBid = asyncHandler(async (req, res) => {
  const { status } = req.body;   // 'accepted' | 'rejected'
  if (!['accepted', 'rejected'].includes(status)) {
    return badRequest(res, "status must be 'accepted' or 'rejected'");
  }

  const bid = await BidOffer.findById(req.params.bidId).populate('requirementId');
  if (!bid) return notFound(res, 'Bid not found');

  // Auth: verify this farmer owns the requirement
  if (String(bid.requirementId.farmerId) !== String(req.user._id)) {
    return forbidden(res, 'You do not own this requirement');
  }

  if (bid.status !== 'pending') {
    return badRequest(res, `Bid is already ${bid.status}`);
  }

  bid.status = status;
  await bid.save();

  // If accepted → update requirement status, reject other pending bids
  if (status === 'accepted') {
    await HarvestRequirement.findByIdAndUpdate(bid.requirementId._id, {
      status:       'in-progress',
      acceptedBidId: bid._id,
    });
    await BidOffer.updateMany(
      { requirementId: bid.requirementId._id, _id: { $ne: bid._id }, status: 'pending' },
      { $set: { status: 'rejected' } }
    );
  }

  return success(res, bid, `Bid ${status} successfully`);
});

/* ═══════════════════════════════════════════════════════════════════════════
   CROP LISTINGS
═══════════════════════════════════════════════════════════════════════════ */

/** POST /api/farmer/crop-listing  — Post a new crop for sale */
const postCropListing = asyncHandler(async (req, res) => {
  const data = { ...req.body, farmerId: req.user._id };

  // Handle uploaded image
  if (req.file) {
    data.image = req.file.filename;
  }

  const listing = await CropListing.create(data);
  return created(res, listing, 'Crop listed successfully');
});

/** GET /api/farmer/crop-listing/my  — My crop listings */
const getMyCropListings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { farmerId: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const [docs, total] = await Promise.all([
    CropListing.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    CropListing.countDocuments(filter),
  ]);
  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/** PATCH /api/farmer/crop-listing/:id  — Edit a listing */
const updateCropListing = asyncHandler(async (req, res) => {
  const listing = await CropListing.findOne({ _id: req.params.id, farmerId: req.user._id });
  if (!listing) return notFound(res, 'Listing not found');

  const allowed = ['cropName', 'quantity', 'price', 'location', 'description', 'status', 'harvest'];
  allowed.forEach(k => { if (req.body[k] !== undefined) listing[k] = req.body[k]; });
  if (req.file) listing.image = req.file.filename;
  await listing.save();
  return success(res, listing, 'Listing updated');
});

/** DELETE /api/farmer/crop-listing/:id */
const deleteCropListing = asyncHandler(async (req, res) => {
  const listing = await CropListing.findOne({ _id: req.params.id, farmerId: req.user._id });
  if (!listing) return notFound(res, 'Listing not found');
  await listing.deleteOne();
  return success(res, {}, 'Listing removed');
});

/* ═══════════════════════════════════════════════════════════════════════════
   BUYER OFFERS (on crop listings)
═══════════════════════════════════════════════════════════════════════════ */

/** GET /api/farmer/buyer-offers  — All CropOffers on my listings */
const getBuyerOffers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const myListingIds = await CropListing.find({ farmerId: req.user._id }).distinct('_id');

  const filter = { listingId: { $in: myListingIds } };
  if (req.query.status) filter.status = req.query.status;

  const [docs, total] = await Promise.all([
    CropOffer.find(filter)
      .populate('buyerId',   'name email phone')
      .populate('listingId', 'cropName quantity price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CropOffer.countDocuments(filter),
  ]);
  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/** PATCH /api/farmer/buyer-offers/:offerId  — Accept / reject / counter buyer offer */
const respondToCropOffer = asyncHandler(async (req, res) => {
  const { status, counterPrice, counterMessage } = req.body;
  const allowed = ['accepted', 'rejected', 'counter'];
  if (!allowed.includes(status)) {
    return badRequest(res, `status must be one of: ${allowed.join(', ')}`);
  }

  const offer = await CropOffer.findById(req.params.offerId).populate('listingId');
  if (!offer) return notFound(res, 'Offer not found');
  if (String(offer.listingId.farmerId) !== String(req.user._id)) {
    return forbidden(res, 'Not your listing');
  }
  if (offer.status !== 'pending') {
    return badRequest(res, `Offer already ${offer.status}`);
  }

  offer.status = status;
  if (status === 'counter') {
    if (!counterPrice) return badRequest(res, 'counterPrice required for counter offer');
    offer.counterPrice   = counterPrice;
    offer.counterMessage = counterMessage;
  }
  await offer.save();
  return success(res, offer, `Offer ${status}`);
});

module.exports = {
  postRequirement, getMyRequirements, updateRequirement,
  getMyOffers, respondToBid,
  postCropListing, getMyCropListings, updateCropListing, deleteCropListing,
  getBuyerOffers, respondToCropOffer,
};
