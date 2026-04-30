const mongoose = require('mongoose');

const serviceListingSchema = new mongoose.Schema(
  {
    providerId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },
    vehicleDetails: {
      type:        String,
      description: String,
      count:       { type: Number, default: 1 },
      capacity:    String,
      registrationNo: String,
    },
    manpowerDetails: {
      available:   { type: Number, default: 0 },
      skills:      [String],
      description: String,
    },
    pricePerDay: {
      type:     Number,
      required: [true, 'Price per day is required'],
      min:      [0, 'Price cannot be negative'],
    },
    availability: {
      isAvailable: { type: Boolean, default: true },
      from:        Date,
      to:          Date,
      notes:       String,
    },
    serviceArea: {
      states:    [String],
      districts: [String],
      radius:    { type: Number, default: 50 },   // km
    },
    serviceType: {
      type: String,
      enum: ['transport', 'manpower', 'harvester', 'cold-storage', 'both'],
    },
    images:   [String],
    rating:   { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceListingSchema.index({ 'availability.isAvailable': 1, isActive: 1 });
serviceListingSchema.index({ serviceType: 1, pricePerDay: 1 });

const ServiceListing = mongoose.model('ServiceListing', serviceListingSchema);
module.exports = ServiceListing;
