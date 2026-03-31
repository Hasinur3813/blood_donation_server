const Donation = require("../models/Donation");
const User = require("../models/User");
const apiResponse = require("../utils/apiResponse");

/**
 * @desc    Log a new donation
 * @route   POST /api/donations
 * @access  Private/Donor/Admin
 */
const logDonation = async (req, res) => {
  const { donorId, requestId, donationDate, location, bloodGroup } = req.body;

  // Verify donor
  const donor = await User.findById(donorId || req.user._id);
  if (!donor || donor.role !== "donor") {
    return res.status(404).json(apiResponse(false, "Donor not found"));
  }

  const donation = await Donation.create({
    donorId: donor._id,
    requestId,
    donationDate,
    location,
    bloodGroup,
  });

  // Update donor's last donation date and total donations
  donor.lastDonation = (donationDate || new Date()).toISOString();
  donor.totalDonations = (donor.totalDonations || 0) + 1;
  await donor.save();

  res
    .status(201)
    .json(apiResponse(true, "Donation logged successfully", donation));
};

/**
 * @desc    Get donation history for a donor
 * @route   GET /api/donations/my-history
 * @access  Private/Donor
 */
const getMyHistory = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const donations = await Donation.find({ donorId: req.user._id })
      .sort({
        donationDate: -1,
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Donation.countDocuments({ donorId: req.user._id });

    res.json(
      apiResponse(true, "Donation history retrieved", {
        donations,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      }),
    );
  } catch (err) {
    res.status(500).json(apiResponse(false, "Server Error"));
  }
};

/**
 * @desc    Get all donations (admin)
 * @route   GET /api/donations
 * @access  Private/Admin
 */
const getAllDonations = async (req, res) => {
  const donations = await Donation.find({})
    .populate("donorId", "fullName email bloodGroup phone")
    .sort({ donationDate: -1 });

  res.json(apiResponse(true, "All donations retrieved", donations));
};

module.exports = {
  logDonation,
  getMyHistory,
  getAllDonations,
};
