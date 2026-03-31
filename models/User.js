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
  },
  {
    timestamps: true,
  },
);

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
