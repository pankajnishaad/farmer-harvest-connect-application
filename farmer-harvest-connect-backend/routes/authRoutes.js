const express = require('express');
const router  = express.Router();

const {
  register, login, getMe, updateProfile, changePassword,
} = require('../controllers/authController');

const { protect } = require('../middlewares/auth');
const {
  registerRules, loginRules, validate,
} = require('../middlewares/validators');

/* POST /api/auth/register */
router.post('/register', registerRules, validate, register);

/* POST /api/auth/login */
router.post('/login', loginRules, validate, login);

/* Protected */
router.get('/me',             protect, getMe);
router.put('/profile',        protect, updateProfile);
router.put('/change-password',protect, changePassword);

module.exports = router;
