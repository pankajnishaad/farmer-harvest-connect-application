const express = require('express');
const router  = express.Router();

const {
  postRequirement, getMyRequirements, updateRequirement,
  getMyOffers, respondToBid,
  postCropListing, getMyCropListings, updateCropListing, deleteCropListing,
  getBuyerOffers, respondToCropOffer,
} = require('../controllers/farmerController');

const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const { harvestRequirementRules, cropListingRules, validate } = require('../middlewares/validators');
const { cropImageUpload } = require('../utils/uploadUtils');

/* All farmer routes require authentication + farmer role */
router.use(protect, authorize('farmer'));

/* ── Harvest Requirements ──────────────────────────────────────────────── */
router.post('/requirements',     harvestRequirementRules, validate, postRequirement);
router.get('/requirements/my',   getMyRequirements);
router.patch('/requirements/:id',updateRequirement);

/* ── Service Offers (bids from providers) ─────────────────────────────── */
router.get('/offers',             getMyOffers);
router.patch('/offers/:bidId',    respondToBid);

/* ── Crop Listings ─────────────────────────────────────────────────────── */
router.post('/crop-listing',
  cropImageUpload.single('image'),
  cropListingRules, validate,
  postCropListing
);
router.get('/crop-listing/my',   getMyCropListings);
router.patch('/crop-listing/:id',
  cropImageUpload.single('image'),
  updateCropListing
);
router.delete('/crop-listing/:id', deleteCropListing);

/* ── Buyer Offers on my crops ──────────────────────────────────────────── */
router.get('/buyer-offers',                getBuyerOffers);
router.patch('/buyer-offers/:offerId',     respondToCropOffer);

module.exports = router;
