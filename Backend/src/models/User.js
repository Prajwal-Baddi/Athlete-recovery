const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const ROLES = ['athlete', 'physiotherapist', 'coach'];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be less than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,      // This creates the index implicitly
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ROLES,
        message: `Role must be one of: ${ROLES.join(', ')}`,
      },
      required: [true, 'Role is required'],
    },
    avatar: {
      url:      { type: String, default: null },
      publicId: { type: String, default: null }, // Cloudinary public_id for deletion
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    // Refresh token — stored hashed for security
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Indexes ────────────────────────────────────────────────────────────────
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// ─── Pre-save: hash password ─────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// ─── Instance methods ────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

// ─── Static helpers ──────────────────────────────────────────────────────────
userSchema.statics.ROLES = ROLES;

const User = mongoose.model('User', userSchema);
module.exports = User;
