import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    phone: { type: String, trim: true },

    // Used by the scheme-matching feature. All optional so users can fill
    // their profile in progressively rather than at signup.
    profile: {
      age: { type: Number, min: 0, max: 120 },
      gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
      annualIncome: { type: Number, min: 0 }, // in INR
      state: { type: String, trim: true },
      category: { type: String, enum: ['general', 'obc', 'sc', 'st', 'ews', 'other'] },
      occupation: { type: String, trim: true },
    },

    role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },

    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '10d',
  });
};

const User = mongoose.model('User', userSchema);
export default User;
