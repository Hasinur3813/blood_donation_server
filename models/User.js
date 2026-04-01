const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name must be at least 2 characters"],
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide a valid email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password must be at least 6 characters"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    gender: {
      type: String,
      required: [true, "Please select your gender"],
    },
    bloodGroup: {
      type: String,
      required: [true, "Please select a blood group"],
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    phone: {
      type: String,
      required: [true, "Valid phone number is required"],
      minlength: [10, "Valid phone number is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      minlength: [2, "City is required"],
    },
    district: {
      type: String,
      required: [true, "District is required"],
      minlength: [2, "District is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      minlength: [2, "Country is required"],
    },
    lastDonation: {
      type: String, // Matching the frontend z.string().optional()
      default: null,
    },
    totalDonations: {
      type: Number,
      default: 0,
    },
    agreedToTerms: {
      type: Boolean,
      required: [true, "You must agree to the terms"],
      validate: {
        validator: function (v) {
          return v === true;
        },
        message: "You must agree to the terms",
      },
    },
    // Keep internal backend fields
    role: {
      type: String,
      enum: ["donor", "moderator", "admin"],
      default: "donor",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpire: {
      type: Date,
      default: null,
    },

    // ── Mixed-in profile fields (safe defaults) ───────────────────────────────
    avatar: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      default: undefined,
      trim: true,
    },
    age: {
      type: Number,
      default: undefined,
      min: 0,
    },
    weight: {
      type: Number,
      default: undefined,
      min: 0,
    },

    // Keep `gender` as-is (required above); this is only for the frontend shape.
    // status: {
    //   type: String,
    //   enum: ["never_donated", "cooling", "eligible", "cooldown"],
    //   default: "never_donated",
    // },
    nextEligibleAt: {
      type: Date,
      default: null,
    },

    donationHistory: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    requestsMade: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    settings: {
      notifications: {
        emergencyAlerts: { type: Boolean, default: true },
        urgentRequests: { type: Boolean, default: true },
        nearbyRequests: { type: Boolean, default: true },
        donationReminders: { type: Boolean, default: true },
        requestUpdates: { type: Boolean, default: true },
        newMessages: { type: Boolean, default: true },
        emailDigest: { type: Boolean, default: true },
        smsAlerts: { type: Boolean, default: true },
      },
      privacy: {
        showInSearch: { type: Boolean, default: true },
        showPhone: { type: Boolean, default: true },
        showEmail: { type: Boolean, default: true },
        showDonationHistory: { type: Boolean, default: true },
        allowDirectContact: { type: Boolean, default: true },
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ── Virtual fields (computed from existing schema) ─────────────────────────────
userSchema.virtual("name").get(function () {
  return this.fullName;
});

userSchema.virtual("status").get(function () {
  const total =
    typeof this.totalDonations === "number" ? this.totalDonations : 0;
  if (total > 10) return "Champion";
  if (total > 5) return "Starter";
  return "Super Hero";
});

userSchema.virtual("livesImpacted").get(function () {
  const total =
    typeof this.totalDonations === "number" ? this.totalDonations : 0;
  return total * 3;
});

// NOTE: kept misspelling `totalLitersDoanted` to match requested frontend shape.
userSchema.virtual("totalLitersDoanted").get(function () {
  const total =
    typeof this.totalDonations === "number" ? this.totalDonations : 0;
  return total * 0.45;
});

userSchema.virtual("memberSince").get(function () {
  return this.createdAt;
});

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user-entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
