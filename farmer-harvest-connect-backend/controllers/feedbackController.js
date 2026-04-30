const asyncHandler = require('express-async-handler');
const Feedback     = require('../models/Feedback');
const User         = require('../models/User');
const {
  success, created, notFound, badRequest, forbidden,
  getPagination, buildPaginationMeta, paginated,
} = require('../utils/response');

/** POST /api/feedback  — Submit feedback */
const submitFeedback = asyncHandler(async (req, res) => {
  const { toUser, rating, comment, referenceType, referenceId, tags } = req.body;

  if (String(req.user._id) === String(toUser)) {
    return badRequest(res, 'You cannot review yourself');
  }

  const target = await User.findById(toUser);
  if (!target) return notFound(res, 'User not found');

  const feedback = await Feedback.create({
    fromUser: req.user._id,
    toUser, rating, comment, referenceType, referenceId, tags,
  });

  /* Update target user's average rating (simple rolling average) */
  const stats = await Feedback.aggregate([
    { $match: { toUser: target._id } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats[0]) {
    await User.findByIdAndUpdate(toUser, {
      'profile.rating':      Math.round(stats[0].avg * 10) / 10,
      'profile.reviewCount': stats[0].count,
    });
  }

  return created(res, feedback, 'Feedback submitted');
});

/** GET /api/feedback/user/:userId  — All feedback for a user */
const getUserFeedback = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { toUser: req.params.userId, isPublic: true };

  const [docs, total] = await Promise.all([
    Feedback.find(filter)
      .populate('fromUser', 'name role profile.avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Feedback.countDocuments(filter),
  ]);
  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/** GET /api/feedback/my  — My submitted feedback */
const getMyFeedback = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const [docs, total] = await Promise.all([
    Feedback.find({ fromUser: req.user._id })
      .populate('toUser', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Feedback.countDocuments({ fromUser: req.user._id }),
  ]);
  return paginated(res, docs, buildPaginationMeta(total, page, limit));
});

/** DELETE /api/feedback/:id  — Delete own review */
const deleteFeedback = asyncHandler(async (req, res) => {
  const fb = await Feedback.findOne({ _id: req.params.id, fromUser: req.user._id });
  if (!fb) return notFound(res, 'Feedback not found');
  await fb.deleteOne();
  return success(res, {}, 'Feedback deleted');
});

module.exports = { submitFeedback, getUserFeedback, getMyFeedback, deleteFeedback };
