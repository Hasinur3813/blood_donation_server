const Donation = require('../models/Donation');
const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');

/**
 * @desc    Log a new donation
 * @route   POST /api/donations
 * @access  Private/Donor/Admin
 */
const logDonation = async (req, res) => {
  const { donorId, requestId, donationDate, location, bloodType } = req.body;

  // Verify donor
  const donor = await User.findById(donorId || req.user._id);
  if (!donor || donor.role !== 'donor') {
    return res.status(404).json(apiResponse(false, 'Donor not found'));
  }

  const donation = await Donation.create({
    donorId: donor._id,
    requestId,
    donationDate,
    location,
    bloodType,
  });

  // Update donor's last donation date
  donor.lastDonationDate = donationDate || Date.now();
  await donor.save();

  res.status(201).json(apiResponse(true, 'Donation logged successfully', donation));
};

/**
 * @desc    Get donation history for a donor
 * @route   GET /api/donations/my-history
 * @access  Private/Donor
 */
const getMyHistory = async (req, res) => {
  const donations = await Donation.find({ donorId: req.user._id }).sort({
    donationDate: -1,
  });

  res.json(apiResponse(true, 'Donation history retrieved', donations));
};

/**
 * @desc    Get all donations (admin)
 * @route   GET /api/donations
 * @access  Private/Admin
 */
const getAllDonations = async (req, res) => {
  const donations = await Donation.find({})
    .populate('donorId', 'name email bloodType phone')
    .sort({ donationDate: -1 });

  res.json(apiResponse(true, 'All donations retrieved', donations));
};

module.exports = {
  logDonation,
  getMyHistory,
  getAllDonations,
};
