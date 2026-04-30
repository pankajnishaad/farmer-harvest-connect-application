const mongoose = require('mongoose');

const bidOfferSchema = new mongoose.Schema(
  {
    providerId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },
    farmerId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },
    requirementId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'HarvestRequirement',
      required: true,
      index:    true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'ServiceListing',
    },
    price: {
      type:     Number,
      required: [true, 'Bid price is required'],
      min:      [1, 'Price must be positive'],
    },
    priceType: {
      type:    String,
      enum:    ['per-day', 'fixed', 'per-quintal'],
      default: 'per-day',
    },
    message: {
      type:     String,
      maxlength: [500, 'Message too long'],
      trim:     true,
    },
    status: {
      type:    String,
      enum:    ['pending', 'accepted', 'rejected', 'withdrawn', 'completed'],
      default: 'pending',
    },
    respondedAt: Date,
  },
  { timestamps: true }
);

/* A provider can bid on a requirement only once */
bidOfferSchema.index({ providerId: 1, requirementId: 1 }, { unique: true });
bidOfferSchema.index({ status: 1, createdAt: -1 });

bidOfferSchema.pre('save', function (next) {
  if (this.isModified('status') && ['accepted', 'rejected'].includes(this.status)) {
    this.respondedAt = new Date();
  }
  next();
});

const BidOffer = mongoose.model('BidOffer', bidOfferSchema);
module.exports = BidOffer;
