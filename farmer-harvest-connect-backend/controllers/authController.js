const asyncHandler = require('express-async-handler');
const User          = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');
const { success, created, badRequest, unauthorized } = require('../utils/response');

/* ── Helper: build safe user object ───────────────────────────────────────── */
const sanitizeUser = (user) => ({
  _id:       user._id,
  name:      user.name,
  email:     user.email,
  phone:     user.phone,
  role:      user.role,
  profile:   user.profile,
  isVerified:user.isVerified,
  createdAt: user.createdAt,
});

/* ─────────────────────────────────────────────────────────────────────────────
   POST /api/auth/register
   Body: { name, email, password, phone, role, profile? }
───────────────────────────────────────────────────────────────────────────── */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role, profile } = req.body;

  /* Prevent admin self-registration */
  if (role === 'admin') {
    return badRequest(res, 'Admin accounts cannot be self-registered');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return badRequest(res, 'An account with this email already exists');
  }

  const user = await User.create({ name, email, password, phone, role, profile });
  const token = generateToken(user);

  return created(res, { token, user: sanitizeUser(user) }, 'Account created successfully');
});

/* ─────────────────────────────────────────────────────────────────────────────
   POST /api/auth/login
   Body: { email, password, role? }   (role enforced for admin)
───────────────────────────────────────────────────────────────────────────── */
const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    return unauthorized(res, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return unauthorized(res, 'Invalid email or password');
  }

  /* Role-gated login (admin portal passes role='admin') */
  if (role && user.role !== role) {
    return unauthorized(res, `This account is not registered as ${role}`);
  }

  if (user.isBlocked) {
    return unauthorized(res, 'Your account has been blocked. Please contact support.');
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user);
  return success(res, { token, user: sanitizeUser(user) }, 'Login successful');
});

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/auth/me    (requires protect middleware)
───────────────────────────────────────────────────────────────────────────── */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return success(res, sanitizeUser(user));
});

/* ─────────────────────────────────────────────────────────────────────────────
   PUT /api/auth/profile   (update own profile)
───────────────────────────────────────────────────────────────────────────── */
const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'profile'];
  const updates = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true, runValidators: true,
  });
  return success(res, sanitizeUser(user), 'Profile updated');
});

/* ─────────────────────────────────────────────────────────────────────────────
   PUT /api/auth/change-password
───────────────────────────────────────────────────────────────────────────── */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return badRequest(res, 'Both currentPassword and newPassword are required');
  }

  const user = await User.findById(req.user._id).select('+password');
  const match = await user.comparePassword(currentPassword);
  if (!match) return badRequest(res, 'Current password is incorrect');

  user.password = newPassword;
  await user.save();
  return success(res, {}, 'Password changed successfully');
});

module.exports = { register, login, getMe, updateProfile, changePassword };
