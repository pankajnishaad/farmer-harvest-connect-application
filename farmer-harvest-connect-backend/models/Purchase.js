const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
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
    },
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'CropOffer',
    },
    quantity: {
      amount: { type: Number, required: true },
      unit:   { type: String, default: 'Quintal' },
    },
    agreedPrice:   { type: Number, required: true },        // price per unit agreed
    totalAmount:   { type: Number, required: true },        // agreedPrice × quantity
    receipt: {
      fileName: String,
      filePath: String,
      uploadedAt: Date,
    },
    paymentStatus: {
      type:    String,
      enum:    ['pending', 'receipt-uploaded', 'verified', 'disputed', 'completed', 'refunded'],
      default: 'pending',
      index:   true,
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'NEFT', 'RTGS', 'Cheque', 'Cash', 'Other'],
    },
    transactionId: String,
    notes:         String,
    disputeReason: String,
    completedAt:   Date,
  },
  { timestamps: true }
);

purchaseSchema.index({ paymentStatus: 1, createdAt: -1 });

purchaseSchema.pre('save', function (next) {
  if (this.isModified('paymentStatus') && this.paymentStatus === 'completed') {
    this.completedAt = new Date();
  }
  next();
});

/* Virtual for formatted total */
purchaseSchema.virtual('formattedTotal').get(function () {
  return `₹${this.totalAmount.toLocaleString('en-IN')}`;
});

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;
