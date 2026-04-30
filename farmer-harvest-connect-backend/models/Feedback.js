const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    fromUser: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },
    toUser: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },
    /* Link feedback to a specific transaction (optional but preferred) */
    referenceType: {
      type: String,
      enum: ['purchase', 'bid', 'service'],
    },
    referenceId: mongoose.Schema.Types.ObjectId,
    rating: {
      type:     Number,
      required: [true, 'Rating is required'],
      min:      [1, 'Rating must be at least 1'],
      max:      [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type:      String,
      maxlength: [1000, 'Comment too long'],
      trim:      true,
    },
    tags:    [String],      // e.g. ["on-time", "quality-produce"]
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/* One review per (fromUser, referenceId) */
feedbackSchema.index({ fromUser: 1, referenceId: 1 }, { unique: true, sparse: true });
feedbackSchema.index({ toUser: 1, createdAt: -1 });

/* Auto-update User rating average after save — handled in controller for simplicity */

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
