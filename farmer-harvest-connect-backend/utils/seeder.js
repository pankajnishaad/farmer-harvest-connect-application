/**
 * Seeder — run once to populate development database.
 * Usage:   node utils/seeder.js          (seed)
 *          node utils/seeder.js --destroy (clear all collections)
 */
require('dotenv').config();
const mongoose       = require('mongoose');
const bcrypt         = require('bcryptjs');

const User               = require('../models/User');
const HarvestRequirement = require('../models/HarvestRequirement');
const ServiceListing     = require('../models/ServiceListing');
const BidOffer           = require('../models/BidOffer');
const CropListing        = require('../models/CropListing');
const CropOffer          = require('../models/CropOffer');
const Purchase           = require('../models/Purchase');
const Feedback           = require('../models/Feedback');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/farmer_harvest_connect');

const hash = (pw) => bcrypt.hashSync(pw, 12);

/* ── Users ──────────────────────────────────────────────────────────────── */
const usersData = [
  { name: 'FHC Admin',         email: 'admin@fhc.com',        password: hash('Admin@1234'),    role: 'admin',    phone: '9000000001', isVerified: true },
  { name: 'Ramesh Patel',      email: 'ramesh@farmer.com',    password: hash('Farmer@123'),    role: 'farmer',   phone: '9876543210', isVerified: true, profile: { location: 'Indore, MP' } },
  { name: 'Suresh Kumar',      email: 'suresh@farmer.com',    password: hash('Farmer@123'),    role: 'farmer',   phone: '9876543211', isVerified: true, profile: { location: 'Vidisha, MP' } },
  { name: 'Kiran Desai',       email: 'kiran@farmer.com',     password: hash('Farmer@123'),    role: 'farmer',   phone: '9876543212', isVerified: true, profile: { location: 'Rajkot, Gujarat' } },
  { name: 'Suresh Logistics',  email: 'provider1@fhc.com',    password: hash('Provider@123'),  role: 'provider', phone: '9812345670', isVerified: true, profile: { businessName: 'Suresh Logistics', serviceType: 'transport' } },
  { name: 'Ravi Transport Co.', email: 'provider2@fhc.com',   password: hash('Provider@123'),  role: 'provider', phone: '9812345671', isVerified: true, profile: { businessName: 'Ravi Transport', serviceType: 'both' } },
  { name: 'Priya Mehta',       email: 'priya@buyer.com',      password: hash('Buyer@123'),     role: 'buyer',    phone: '9800001111', isVerified: true, profile: { location: 'Mumbai, MH' } },
  { name: 'Anil Sharma',       email: 'anil@buyer.com',       password: hash('Buyer@123'),     role: 'buyer',    phone: '9800002222', isVerified: true, profile: { location: 'Pune, MH' } },
];

async function seed() {
  try {
    console.log('🌱 Starting seeder...\n');

    /* Clear existing */
    await Promise.all([
      User.deleteMany(), HarvestRequirement.deleteMany(),
      ServiceListing.deleteMany(), BidOffer.deleteMany(),
      CropListing.deleteMany(), CropOffer.deleteMany(),
      Purchase.deleteMany(), Feedback.deleteMany(),
    ]);
    console.log('✅ Collections cleared');

    /* Insert users (with pre-hashed passwords — bypass pre-save hook) */
    const users = await User.insertMany(usersData, { validateBeforeSave: false });
    console.log(`✅ ${users.length} users seeded`);

    const [_admin, farmer1, farmer2, farmer3, provider1, provider2, buyer1, buyer2] = users;

    /* Services */
    const services = await ServiceListing.insertMany([
      {
        providerId:  provider1._id,
        vehicleDetails: { type: 'Truck (10 Ton)', count: 3, capacity: '10 Ton' },
        manpowerDetails: { available: 0 },
        pricePerDay: 4200, serviceType: 'transport',
        availability: { isAvailable: true },
        serviceArea: { states: ['Madhya Pradesh', 'Gujarat'], radius: 200 },
        isActive: true,
      },
      {
        providerId: provider2._id,
        vehicleDetails: { type: 'Tractor + Trailer', count: 2, capacity: '5 Ton' },
        manpowerDetails: { available: 8, skills: ['harvesting', 'loading'] },
        pricePerDay: 3500, serviceType: 'both',
        availability: { isAvailable: true },
        serviceArea: { states: ['Maharashtra', 'MP'], radius: 150 },
        isActive: true,
      },
    ]);
    console.log(`✅ ${services.length} service listings seeded`);

    /* Harvest Requirements */
    const requirements = await HarvestRequirement.insertMany([
      {
        farmerId: farmer1._id, vehicleType: 'Truck (10 Ton)', manpower: 5,
        cropType: 'Wheat',
        quantity: { amount: 200, unit: 'Quintal' },
        duration: { value: 3, unit: 'Days' },
        location: { address: 'Sanwer, Indore, Madhya Pradesh', state: 'Madhya Pradesh' },
        urgency: 'urgent', status: 'open',
      },
      {
        farmerId: farmer2._id, vehicleType: 'Tractor + Trailer', manpower: 3,
        cropType: 'Soybean',
        quantity: { amount: 80, unit: 'Quintal' },
        duration: { value: 2, unit: 'Days' },
        location: { address: 'Ganj Basoda, Vidisha, MP', state: 'Madhya Pradesh' },
        urgency: 'normal', status: 'open',
      },
    ]);
    console.log(`✅ ${requirements.length} harvest requirements seeded`);

    /* Bids */
    const bids = await BidOffer.insertMany([
      {
        providerId: provider1._id, farmerId: farmer1._id,
        requirementId: requirements[0]._id, serviceId: services[0]._id,
        price: 4200, priceType: 'per-day',
        message: 'We have 3 trucks available, experienced drivers, can start tomorrow.',
        status: 'pending',
      },
      {
        providerId: provider2._id, farmerId: farmer1._id,
        requirementId: requirements[0]._id,
        price: 3800, priceType: 'per-day',
        message: 'Flexible schedule, can arrange manpower too.',
        status: 'pending',
      },
    ]);
    console.log(`✅ ${bids.length} bids seeded`);

    /* Crop Listings */
    const listings = await CropListing.insertMany([
      {
        farmerId: farmer1._id, cropName: 'Wheat',
        category: 'Cereals',
        quantity: { amount: 500, unit: 'Quintal' },
        price: { amount: 2150, unit: 'per Quintal', negotiable: true },
        location: { address: 'Sanwer, Indore, MP', district: 'Indore', state: 'Madhya Pradesh' },
        harvest: { season: 'Rabi', grade: 'A' },
        description: 'Premium quality wheat, no pesticide residues, properly dried.',
        status: 'active',
      },
      {
        farmerId: farmer2._id, cropName: 'Soybean',
        category: 'Oilseeds',
        quantity: { amount: 120, unit: 'Quintal' },
        price: { amount: 4800, unit: 'per Quintal', negotiable: true },
        location: { address: 'Vidisha, MP', district: 'Vidisha', state: 'Madhya Pradesh' },
        harvest: { season: 'Kharif', grade: 'Premium' },
        status: 'active',
      },
      {
        farmerId: farmer3._id, cropName: 'Groundnut',
        category: 'Oilseeds',
        quantity: { amount: 200, unit: 'Quintal' },
        price: { amount: 5200, unit: 'per Quintal', negotiable: false },
        location: { address: 'Rajkot, Gujarat', state: 'Gujarat' },
        harvest: { season: 'Kharif', grade: 'A' },
        status: 'active',
      },
    ]);
    console.log(`✅ ${listings.length} crop listings seeded`);

    /* Crop Offers */
    const offers = await CropOffer.insertMany([
      {
        buyerId: buyer1._id, farmerId: farmer1._id,
        listingId: listings[0]._id,
        offerPrice: 2100, quantity: { amount: 200, unit: 'Quintal' },
        message: 'Looking for bulk purchase, can pick up within 3 days.',
        status: 'pending',
      },
      {
        buyerId: buyer2._id, farmerId: farmer2._id,
        listingId: listings[1]._id,
        offerPrice: 4700, quantity: { amount: 80, unit: 'Quintal' },
        message: 'Direct export buyer, need quality certificate.',
        status: 'accepted',
      },
    ]);
    console.log(`✅ ${offers.length} crop offers seeded`);

    /* Purchase */
    const purchase = await Purchase.create({
      buyerId:    buyer2._id,
      farmerId:   farmer2._id,
      listingId:  listings[1]._id,
      offerId:    offers[1]._id,
      quantity:   { amount: 80, unit: 'Quintal' },
      agreedPrice: 4700,
      totalAmount: 80 * 4700,
      paymentMethod: 'NEFT',
      paymentStatus: 'receipt-uploaded',
    });
    console.log(`✅ 1 purchase seeded (Total: ₹${purchase.totalAmount.toLocaleString()})`);

    /* Feedback */
    await Feedback.create({
      fromUser: buyer1._id,
      toUser:   farmer1._id,
      rating:   5,
      comment:  'Excellent quality wheat! Very honest farmer, highly recommend.',
      isPublic: true,
    });
    console.log('✅ 1 feedback seeded');

    console.log('\n🎉 Seeding complete!\n');
    console.log('Demo credentials:');
    console.log('  Admin:    admin@fhc.com      / Admin@1234');
    console.log('  Farmer:   ramesh@farmer.com  / Farmer@123');
    console.log('  Provider: provider1@fhc.com  / Provider@123');
    console.log('  Buyer:    priya@buyer.com    / Buyer@123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder error:', err);
    process.exit(1);
  }
}

async function destroy() {
  try {
    console.log('💣 Destroying all data...');
    await Promise.all([
      User.deleteMany(), HarvestRequirement.deleteMany(),
      ServiceListing.deleteMany(), BidOffer.deleteMany(),
      CropListing.deleteMany(), CropOffer.deleteMany(),
      Purchase.deleteMany(), Feedback.deleteMany(),
    ]);
    console.log('✅ All collections cleared');
    process.exit(0);
  } catch (err) {
    console.error('❌ Destroy error:', err);
    process.exit(1);
  }
}

if (process.argv.includes('--destroy')) {
  destroy();
} else {
  seed();
}
