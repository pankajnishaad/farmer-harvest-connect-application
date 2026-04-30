const express = require('express');
const router  = express.Router();

const {
  getDashboardStats,
  getUsers, getUserById, toggleBlockUser, deleteUser,
  getTransactions, verifyTransaction, flagDispute,
  getAllListings, removeListing, updateListingStatus,
  getDisputes, resolveDispute,
} = require('../controllers/adminController');

const { protect }   = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');

router.use(protect, authorize('admin'));

/* Dashboard */
router.get('/dashboard-stats', getDashboardStats);

/* Users */
router.get('/users',           getUsers);
router.get('/users/:id',       getUserById);
router.put('/block-user/:id',  toggleBlockUser);
router.delete('/users/:id',    deleteUser);

/* Transactions */
router.get('/transactions',                   getTransactions);
router.patch('/transactions/:id/verify',      verifyTransaction);
router.patch('/transactions/:id/dispute',     flagDispute);

/* Listings */
router.get('/listings',                       getAllListings);
router.delete('/listings/:id',                removeListing);
router.patch('/listings/:id/status',          updateListingStatus);

/* Disputes */
router.get('/disputes',                       getDisputes);
router.patch('/disputes/:id/resolve',         resolveDispute);

module.exports = router;
