import { model, Schema } from 'mongoose';

const otpSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ['email_verification', 'password_reset', 'email_change'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  attemptCount: {
    type: Number,
    default: 0,
  },
});

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: function () {
        return this.loginMethod === 'email';
      },
    },
    password: {
      type: String,
      required: function () {
        return this.loginMethod === 'email';
      },
    },
    passwordHistory: {
      type: [String],
      default: [],
    },
    lastPasswordChangeAt: {
      type: Date,
      default: Date.now,
    },
    loginMethod: {
      type: String,
      enum: ['email', 'google', 'github'],
      default: 'email',
    },
    googleId: {
      type: String,
    },
    githubId: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otpRecords: {
      type: [otpSchema],
      default: [],
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    isFrozen: {
      type: Boolean,
      default: false,
    },
    freezeUntil: {
      type: Date,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    lockedReason: {
      type: String,
      enum: ['too_many_failed_logins', 'otp_abuse'],
      default: null,
    },
    emailChangeRequest: {
      newEmail: String,
      otp: String,
      attemptCount: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = model('User', userSchema);

export default User;
