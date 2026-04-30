const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');

const ROLES = ['farmer', 'provider', 'buyer', 'admin'];

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
      maxlength:[100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type:     String,
      required: [true, 'Password is required'],
      minlength:[6, 'Password must be at least 6 characters'],
      select:   false,              // never returned in queries by default
    },
    phone: {
      type:  String,
      trim:  true,
      match: [/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'],
    },
    role: {
      type:     String,
      enum:     ROLES,
      required: [true, 'Role is required'],
    },
    isBlocked: {
      type:    Boolean,
      default: false,
    },
    isVerified: {
      type:    Boolean,
      default: false,
    },
    /* Role-specific profile data */
    profile: {
      location:     String,
      businessName: String,
      serviceType:  String,     // provider: vehicles, labour, both
      vehicleCount: Number,
      bio:          String,
      avatar:       String,
    },
    lastLogin: Date,
    resetPasswordToken:   String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        delete ret.__v;
        return ret;
      },
    },
  }
);

/* ── Indexes ────────────────────────────────────────────────────────────────── */
// email unique index is already enforced by `unique: true` in schema field definition
userSchema.index({ role: 1, isBlocked: 1 });

/* ── Pre-save: hash password ────────────────────────────────────────────────── */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt   = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* ── Instance methods ───────────────────────────────────────────────────────── */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isActive = function () {
  return !this.isBlocked;
};

/* ── Static methods ─────────────────────────────────────────────────────────── */
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase().trim() }).select('+password');
};

const User = mongoose.model('User', userSchema);
module.exports = User;
