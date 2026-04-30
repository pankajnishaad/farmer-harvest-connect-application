const express = require('express');
const router  = express.Router();

const {
  getCropListings, getCropListingById,
  makeOffer, getMyOffers,
  initiatePurchase, uploadReceipt, getMyOrders, getOrderById,
} = require('../controllers/buyerController');

const { protect }   = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const { offerRules, validate } = require('../middlewares/validators');
const { receiptUpload } = require('../utils/uploadUtils');

/* Public listing browse — no auth needed */
router.get('/crop-listings',      getCropListings);
router.get('/crop-listings/:id',  getCropListingById);

/* Protected buyer routes */
router.use(protect, authorize('buyer'));

router.post('/make-offer',  offerRules, validate, makeOffer);
router.get('/my-offers',    getMyOffers);

router.post('/purchase',    initiatePurchase);
router.post('/upload-receipt/:purchaseId',
  receiptUpload.single('receipt'),
  uploadReceipt
);
router.get('/orders',       getMyOrders);
router.get('/orders/:id',   getOrderById);

module.exports = router;
