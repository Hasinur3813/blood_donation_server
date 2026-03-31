const mongoose = require("mongoose");

const donationRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Patient Information
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    patientAge: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
    },
    patientGender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    patientCondition: {
      type: String,
      required: true,
      trim: true,
    },

    // Blood Requirements
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    unitsRequired: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    componentType: {
      type: String,
      enum: ["whole_blood", "platelets", "plasma", "red_cells"],
      required: true,
    },

    // Hospital Information
    hospital: {
      type: String,
      required: true,
      trim: true,
    },
    division: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    ward: {
      type: String,
      trim: true,
    },

    // Medical Staff
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },
    doctorContact: {
      type: String,
      trim: true,
    },

    // Urgency & Timeline
    urgencyLevel: {
      type: String,
      enum: ["normal", "urgent", "emergency"],
      required: true,
    },
    requiredBy: {
      type: Date,
      required: true,
    },
    requiredByTime: {
      type: String,
      trim: true,
    },
    specialInstructions: {
      type: String,
      trim: true,
    },

    // Contact Information
    requesterName: {
      type: String,
      required: true,
      trim: true,
    },
    relation: {
      type: String,
      required: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    alternatePhone: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // Status & Matching
    status: {
      type: String,
      enum: ["pending", "matched", "completed", "cancelled", "expired"],
      default: "pending",
    },
    matchedDonorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Additional fields
    notes: {
      type: String,
      trim: true,
    },
    requestNumber: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

// Generate unique request number before saving
donationRequestSchema.pre("save", async function (next) {
  if (!this.requestNumber) {
    const count = await mongoose.model("DonationRequest").countDocuments();
    this.requestNumber = `REQ${(count + 1).toString().padStart(6, "0")}`;
  }
  next();
});

module.exports = mongoose.model("DonationRequest", donationRequestSchema);
