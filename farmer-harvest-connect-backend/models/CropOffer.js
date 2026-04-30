const mongoose = require('mongoose');

const cropOfferSchema = new mongoose.Schema(
  {
    buyerId: {
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
    listingId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'CropListing',
      required: true,
      index:    true,
    },
    offerPrice: {
      type:     Number,
      required: [true, 'Offer price is required'],
      min:      [1, 'Offer price must be positive'],
    },
    quantity: {
      amount: { type: Number, required: true, min: [0.1, 'Quantity must be positive'] },
      unit:   { type: String, default: 'Quintal' },
    },
    message: {
      type:      String,
      maxlength: [500, 'Message too long'],
      trim:      true,
    },
    status: {
      type:    String,
      enum:    ['pending', 'accepted', 'rejected', 'counter', 'withdrawn', 'completed'],
      default: 'pending',
    },
    counterPrice:  Number,
    counterMessage: String,
    respondedAt:   Date,
    expiresAt: {
      type:    Date,
      default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    },
  },
  { timestamps: true }
);

cropOfferSchema.index({ status: 1, createdAt: -1 });

cropOfferSchema.pre('save', function (next) {
  if (this.isModified('status') && ['accepted', 'rejected', 'counter'].includes(this.status)) {
    this.respondedAt = new Date();
  }
  next();
});

const CropOffer = mongoose.model('CropOffer', cropOfferSchema);
module.exports = CropOffer;
