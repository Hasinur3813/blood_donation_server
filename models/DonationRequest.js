const mongoose = require('mongoose');

const donationRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true,
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency'],
      default: 'medium',
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'matched', 'completed', 'cancelled'],
      default: 'pending',
    },
    matchedDonorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DonationRequest', donationRequestSchema);
