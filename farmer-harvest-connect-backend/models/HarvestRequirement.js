const mongoose = require('mongoose');

const harvestRequirementSchema = new mongoose.Schema(
  {
    farmerId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },
    vehicleType: {
      type:     String,
      required: [true, 'Vehicle type is required'],
      enum: [
        'Truck (5 Ton)', 'Truck (10 Ton)', 'Tractor + Trailer',
        'Mini Truck (2 Ton)', 'Combine Harvester', 'Tempo', 'Any',
      ],
    },
    manpower: {
      type:    Number,
      default: 0,
      min:     [0, 'Manpower cannot be negative'],
    },
    cropType: {
      type:     String,
      required: [true, 'Crop type is required'],
      trim:     true,
    },
    quantity: {
      amount: { type: Number, required: true, min: [0.1, 'Quantity must be positive'] },
      unit:   { type: String, enum: ['Quintal', 'Ton', 'Kg', 'Acre'], default: 'Quintal' },
    },
    duration: {
      value: { type: Number, required: true, min: [1, 'Duration must be at least 1'] },
      unit:  { type: String, enum: ['Days', 'Weeks'], default: 'Days' },
    },
    location: {
      address:   { type: String, required: [true, 'Location is required'], trim: true },
      district:  String,
      state:     String,
      pincode:   String,
    },
    urgency: {
      type:    String,
      enum:    ['normal', 'urgent', 'immediate'],
      default: 'normal',
    },
    notes: String,
    status: {
      type:    String,
      enum:    ['open', 'in-progress', 'completed', 'cancelled'],
      default: 'open',
    },
    acceptedBidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'BidOffer',
    },
  },
  { timestamps: true }
);

harvestRequirementSchema.index({ status: 1, createdAt: -1 });
harvestRequirementSchema.index({ 'location.state': 1, cropType: 1 });

const HarvestRequirement = mongoose.model('HarvestRequirement', harvestRequirementSchema);
module.exports = HarvestRequirement;
