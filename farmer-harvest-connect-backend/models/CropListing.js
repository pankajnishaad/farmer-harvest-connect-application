const mongoose = require('mongoose');

const cropListingSchema = new mongoose.Schema(
  {
    farmerId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },
    cropName: {
      type:     String,
      required: [true, 'Crop name is required'],
      trim:     true,
    },
    category: {
      type: String,
      enum: ['Cereals', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits', 'Cash Crops', 'Other'],
      default: 'Other',
    },
    quantity: {
      amount: { type: Number, required: true, min: [0.1, 'Quantity must be positive'] },
      unit:   { type: String, enum: ['Quintal', 'Ton', 'Kg', 'Bag'], default: 'Quintal' },
    },
    price: {
      amount:   { type: Number, required: [true, 'Price is required'], min: [1, 'Price must be positive'] },
      unit:     { type: String, default: 'per Quintal' },
      negotiable: { type: Boolean, default: true },
    },
    image:       String,               // relative path stored, full URL built at runtime
    images:      [String],
    location: {
      address:  { type: String, required: true, trim: true },
      district: String,
      state:    String,
      pincode:  String,
    },
    harvest: {
      date:    Date,
      season:  { type: String, enum: ['Kharif', 'Rabi', 'Zaid'] },
      grade:   { type: String, enum: ['A', 'B', 'C', 'Premium'], default: 'A' },
    },
    description:   String,
    status: {
      type:    String,
      enum:    ['active', 'sold', 'expired', 'withdrawn'],
      default: 'active',
      index:   true,
    },
    views:        { type: Number, default: 0 },
    offerCount:   { type: Number, default: 0 },
    expiresAt: {
      type:    Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  },
  { timestamps: true }
);

cropListingSchema.index({ status: 1, createdAt: -1 });
cropListingSchema.index({ cropName: 'text', 'location.state': 1, 'location.district': 1 });
cropListingSchema.index({ 'price.amount': 1 });

const CropListing = mongoose.model('CropListing', cropListingSchema);
module.exports = CropListing;
