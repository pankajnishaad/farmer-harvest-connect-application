const asyncHandler  = require('express-async-handler');
const User          = require('../models/User');
const HarvestRequirement = require('../models/HarvestRequirement');
const CropListing   = require('../models/CropListing');
const BidOffer      = require('../models/BidOffer');
const CropOffer     = require('../models/CropOffer');
const Purchase      = require('../models/Purchase');
const Feedback      = require('../models/Feedback');
const ServiceListing= require('../models/ServiceListing');
const {
  success, notFound, badRequest, forbidden,
  getPagination, buildPaginationMeta, paginated,
} = require('../utils/response');

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD STATS
═══════════════════════════════════════════════════════════════════════════ */

/** GET /api/admin/dashboard-stats */
const getDashboardStats = asyncHandler(async (_req, res) => {
  const [
    totalUsers, farmers, providers, buyers,
    totalListings, activeListings,
    totalTransactions, pendingReceipts, completedPurchases,
    totalBids, acceptedBids,
    totalRequirements, openRequirements,
    totalFeedbacks, totalRevenue,
    recentUsers, recentPurchases,
    monthlySales,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'farmer' }),
    User.countDocuments({ role: 'provider' }),
    User.countDocuments({ role: 'buyer' }),
    CropListing.countDocuments(),
    CropListing.countDocuments({ status: 'active' }),
    Purchase.countDocuments(),
    Purchase.countDocuments({ paymentStatus: 'receipt-uploaded' }),
    Purchase.countDocuments({ paymentStatus: 'completed' }),
    BidOffer.countDocuments(),
    BidOffer.countDocuments({ status: 'accepted' }),
    HarvestRequirement.countDocuments(),
    HarvestRequirement.countDocuments({ status: 'open' }),
    Feedback.countDocuments(),
    Purchase.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt isBlocked').lean(),
    Purchase.find().sort({ createdAt: -1 }).limit(5)
      .populate('buyerId',  'name')
      .populate('listingId','cropName')
      .lean(),
    // Monthly sales for chart (last 6 months)
    Purchase.aggregate([
      { $match: { paymentStatus: 'completed', createdAt: { $gte: new Date(Date.now() - 180 * 86400000) } } },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        total: { $sum: '$totalAmount' },
        count: { $sum: 1 },
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
  ]);

  const stats = {
    users: { total: totalUsers, farmers, providers, buyers },
    listings: { total: totalListings, active: activeListings },
    transactions: {
      total: totalTransactions,
      pendingReceipts,
      completed: completedPurchases,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
    bids: { total: totalBids, accepted: acceptedBids },
    requirements: { total: totalRequirements, open: openRequirements },
    feedback:  { total: totalFeedbacks },
    recentUsers,
    recentPurchases,
    monthlySales,
  };

  return success(res, stats, 'Dashboard stats fetched');
});

/* ═══════════════════════════════════════════════════════════════════════════
   USERS
═══════════════════════════════════════════════════════════════════════════ */

/**
 * GET /api/admin/users
 * Query: role, isBlocked, search, page, limit
 */
const getUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { role, isBlocked, search } = req.query;

  const filter = {};
  if (role)      filter.role      = role;
  if (isBlocked !== undefined) filter.isBlocked = isBlocked === 'true';
  if (search) {
    filter.$or = [
      { name:  new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { phone: new RegExp(search, 'i') },
    ];
  }

  const [docs, total] = await Promise.all([
    User.find(filter)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);
  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/** GET /api/admin/users/:id */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return notFound(res, 'User not found');
  return success(res, user);
});

/** PUT /api/admin/block-user/:id */
const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return notFound(res, 'User not found');
  if (user.role === 'admin') return forbidden(res, 'Cannot block another admin');

  user.isBlocked = !user.isBlocked;
  await user.save({ validateBeforeSave: false });

  const action = user.isBlocked ? 'blocked' : 'unblocked';
  return success(res, { id: user._id, isBlocked: user.isBlocked }, `User ${action} successfully`);
});

/** DELETE /api/admin/users/:id  — Hard delete (use with caution) */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return notFound(res, 'User not found');
  if (user.role === 'admin') return forbidden(res, 'Cannot delete an admin user');
  await user.deleteOne();
  return success(res, {}, 'User deleted permanently');
});

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSACTIONS
═══════════════════════════════════════════════════════════════════════════ */

/**
 * GET /api/admin/transactions
 * Query: paymentStatus, page, limit
 */
const getTransactions = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

  const [docs, total] = await Promise.all([
    Purchase.find(filter)
      .populate('buyerId',   'name email phone')
      .populate('farmerId',  'name email phone')
      .populate('listingId', 'cropName quantity price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Purchase.countDocuments(filter),
  ]);
  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/** PATCH /api/admin/transactions/:id/verify  — Verify receipt & mark completed */
const verifyTransaction = asyncHandler(async (req, res) => {
  const purchase = await Purchase.findById(req.params.id);
  if (!purchase) return notFound(res, 'Transaction not found');
  if (purchase.paymentStatus !== 'receipt-uploaded') {
    return badRequest(res, 'Can only verify transactions with uploaded receipts');
  }
  purchase.paymentStatus = 'completed';
  await purchase.save();

  // Mark the crop listing as sold
  await CropListing.findByIdAndUpdate(purchase.listingId, { status: 'sold' });

  return success(res, purchase, 'Transaction verified and completed');
});

/** PATCH /api/admin/transactions/:id/dispute */
const flagDispute = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const purchase = await Purchase.findById(req.params.id);
  if (!purchase) return notFound(res, 'Transaction not found');

  purchase.paymentStatus = 'disputed';
  purchase.disputeReason = reason;
  await purchase.save();
  return success(res, purchase, 'Transaction flagged as disputed');
});

/* ═══════════════════════════════════════════════════════════════════════════
   LISTINGS MANAGEMENT
═══════════════════════════════════════════════════════════════════════════ */

/** GET /api/admin/listings */
const getAllListings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { status, cropName } = req.query;

  const filter = {};
  if (status)   filter.status   = status;
  if (cropName) filter.cropName = new RegExp(cropName, 'i');

  const [docs, total] = await Promise.all([
    CropListing.find(filter)
      .populate('farmerId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CropListing.countDocuments(filter),
  ]);
  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/** DELETE /api/admin/listings/:id */
const removeListing = asyncHandler(async (req, res) => {
  const listing = await CropListing.findById(req.params.id);
  if (!listing) return notFound(res, 'Listing not found');
  await listing.deleteOne();
  return success(res, {}, 'Listing removed by admin');
});

/** PATCH /api/admin/listings/:id/status */
const updateListingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ['active', 'withdrawn', 'expired'];
  if (!allowed.includes(status)) return badRequest(res, `Status must be: ${allowed.join(', ')}`);

  const listing = await CropListing.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!listing) return notFound(res, 'Listing not found');
  return success(res, listing, 'Listing status updated');
});

/* ═══════════════════════════════════════════════════════════════════════════
   DISPUTES
═══════════════════════════════════════════════════════════════════════════ */

/** GET /api/admin/disputes */
const getDisputes = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { paymentStatus: 'disputed' };

  const [docs, total] = await Promise.all([
    Purchase.find(filter)
      .populate('buyerId',   'name email phone')
      .populate('farmerId',  'name email phone')
      .populate('listingId', 'cropName price')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Purchase.countDocuments(filter),
  ]);
  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/** PATCH /api/admin/disputes/:id/resolve */
const resolveDispute = asyncHandler(async (req, res) => {
  const { resolution } = req.body;  // 'completed' | 'refunded'
  const allowed = ['completed', 'refunded'];
  if (!allowed.includes(resolution)) return badRequest(res, `Resolution must be: ${allowed.join(' or ')}`);

  const purchase = await Purchase.findOne({ _id: req.params.id, paymentStatus: 'disputed' });
  if (!purchase) return notFound(res, 'Disputed transaction not found');

  purchase.paymentStatus = resolution;
  await purchase.save();
  return success(res, purchase, `Dispute resolved as ${resolution}`);
});

module.exports = {
  getDashboardStats,
  getUsers, getUserById, toggleBlockUser, deleteUser,
  getTransactions, verifyTransaction, flagDispute,
  getAllListings, removeListing, updateListingStatus,
  getDisputes, resolveDispute,
};
