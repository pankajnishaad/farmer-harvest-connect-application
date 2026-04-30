const asyncHandler  = require('express-async-handler');
const CropListing   = require('../models/CropListing');
const CropOffer     = require('../models/CropOffer');
const Purchase      = require('../models/Purchase');
const {
  success, created, notFound, badRequest, forbidden,
  getPagination, buildPaginationMeta, paginated,
} = require('../utils/response');

/* ═══════════════════════════════════════════════════════════════════════════
   CROP LISTINGS — PUBLIC BROWSE
═══════════════════════════════════════════════════════════════════════════ */

/**
 * GET /api/buyer/crop-listings
 * Query: search, cropName, category, state, district,
 *        minPrice, maxPrice, season, grade, page, limit, sort
 */
const getCropListings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const {
    search, cropName, category, state, district,
    minPrice, maxPrice, season, grade, sort = 'newest',
  } = req.query;

  /* Build filter */
  const filter = { status: 'active' };

  if (search) {
    filter.$or = [
      { cropName:   new RegExp(search, 'i') },
      { description:new RegExp(search, 'i') },
      { 'location.state':    new RegExp(search, 'i') },
      { 'location.district': new RegExp(search, 'i') },
    ];
  }
  if (cropName)  filter.cropName          = new RegExp(cropName, 'i');
  if (category)  filter.category          = category;
  if (state)     filter['location.state'] = new RegExp(state, 'i');
  if (district)  filter['location.district'] = new RegExp(district, 'i');
  if (season)    filter['harvest.season'] = season;
  if (grade)     filter['harvest.grade']  = grade;
  if (minPrice || maxPrice) {
    filter['price.amount'] = {};
    if (minPrice) filter['price.amount'].$gte = parseFloat(minPrice);
    if (maxPrice) filter['price.amount'].$lte = parseFloat(maxPrice);
  }

  /* Build sort */
  const sortMap = {
    newest:       { createdAt: -1 },
    oldest:       { createdAt:  1 },
    price_asc:    { 'price.amount':  1 },
    price_desc:   { 'price.amount': -1 },
    popular:      { offerCount: -1 },
  };
  const sortOrder = sortMap[sort] || sortMap.newest;

  const [docs, total] = await Promise.all([
    CropListing.find(filter)
      .populate('farmerId', 'name phone profile.location')
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .lean(),
    CropListing.countDocuments(filter),
  ]);

  /* Increment view counts asynchronously (fire and forget) */
  if (docs.length) {
    CropListing.updateMany(
      { _id: { $in: docs.map(d => d._id) } },
      { $inc: { views: 1 } }
    ).exec();
  }

  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/** GET /api/buyer/crop-listings/:id — Single listing detail */
const getCropListingById = asyncHandler(async (req, res) => {
  const listing = await CropListing.findById(req.params.id)
    .populate('farmerId', 'name phone profile');
  if (!listing || listing.status === 'withdrawn') return notFound(res, 'Listing not found');
  return success(res, listing);
});

/* ═══════════════════════════════════════════════════════════════════════════
   CROP OFFERS
═══════════════════════════════════════════════════════════════════════════ */

/** POST /api/buyer/make-offer */
const makeOffer = asyncHandler(async (req, res) => {
  const { listingId, offerPrice, quantity, message } = req.body;

  const listing = await CropListing.findById(listingId);
  if (!listing) return notFound(res, 'Crop listing not found');
  if (listing.status !== 'active') return badRequest(res, 'This listing is no longer active');
  if (String(listing.farmerId) === String(req.user._id)) {
    return badRequest(res, 'You cannot make an offer on your own listing');
  }

  /* Check for duplicate pending offer */
  const existing = await CropOffer.findOne({
    buyerId: req.user._id, listingId, status: 'pending',
  });
  if (existing) return badRequest(res, 'You already have a pending offer on this listing');

  const offer = await CropOffer.create({
    buyerId:    req.user._id,
    farmerId:   listing.farmerId,
    listingId,
    offerPrice,
    quantity,
    message,
  });

  /* Increment offer count on listing */
  await CropListing.findByIdAndUpdate(listingId, { $inc: { offerCount: 1 } });

  return created(res, offer, 'Offer submitted to farmer');
});

/** GET /api/buyer/my-offers  — Buyer's own crop offers */
const getMyOffers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { buyerId: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const [docs, total] = await Promise.all([
    CropOffer.find(filter)
      .populate('listingId', 'cropName quantity price image location status')
      .populate('farmerId',  'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CropOffer.countDocuments(filter),
  ]);
  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/* ═══════════════════════════════════════════════════════════════════════════
   PURCHASES
═══════════════════════════════════════════════════════════════════════════ */

/** POST /api/buyer/purchase  — Initiate purchase after offer accepted */
const initiatePurchase = asyncHandler(async (req, res) => {
  const { offerId, paymentMethod, transactionId, notes } = req.body;

  const offer = await CropOffer.findOne({
    _id: offerId, buyerId: req.user._id, status: 'accepted',
  }).populate('listingId');

  if (!offer) return notFound(res, 'Accepted offer not found');

  /* Prevent duplicate purchase */
  const exists = await Purchase.findOne({ buyerId: req.user._id, listingId: offer.listingId._id });
  if (exists) return badRequest(res, 'Purchase already initiated for this listing');

  const totalAmount = offer.offerPrice * offer.quantity.amount;

  const purchase = await Purchase.create({
    buyerId:    req.user._id,
    farmerId:   offer.farmerId,
    listingId:  offer.listingId._id,
    offerId:    offer._id,
    quantity:   offer.quantity,
    agreedPrice:offer.offerPrice,
    totalAmount,
    paymentMethod,
    transactionId,
    notes,
  });

  return created(res, purchase, 'Purchase initiated. Please upload your payment receipt.');
});

/** POST /api/buyer/upload-receipt/:purchaseId */
const uploadReceipt = asyncHandler(async (req, res) => {
  if (!req.file) return badRequest(res, 'Receipt file is required');

  const purchase = await Purchase.findOne({ _id: req.params.purchaseId, buyerId: req.user._id });
  if (!purchase) return notFound(res, 'Purchase not found');
  if (purchase.paymentStatus === 'completed') return badRequest(res, 'Purchase already completed');

  purchase.receipt       = { fileName: req.file.filename, filePath: req.file.path, uploadedAt: new Date() };
  purchase.paymentStatus = 'receipt-uploaded';
  await purchase.save();

  return success(res, purchase, 'Receipt uploaded. Farmer will verify and confirm.');
});

/** GET /api/buyer/orders  — My purchase history */
const getMyOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { buyerId: req.user._id };
  if (req.query.status) filter.paymentStatus = req.query.status;

  const [docs, total] = await Promise.all([
    Purchase.find(filter)
      .populate('listingId', 'cropName image location')
      .populate('farmerId',  'name phone profile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Purchase.countDocuments(filter),
  ]);
  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/** GET /api/buyer/orders/:id  — Single order detail */
const getOrderById = asyncHandler(async (req, res) => {
  const purchase = await Purchase.findOne({ _id: req.params.id, buyerId: req.user._id })
    .populate('listingId')
    .populate('farmerId', 'name phone profile');
  if (!purchase) return notFound(res, 'Order not found');
  return success(res, purchase);
});

module.exports = {
  getCropListings, getCropListingById,
  makeOffer, getMyOffers,
  initiatePurchase, uploadReceipt, getMyOrders, getOrderById,
};
