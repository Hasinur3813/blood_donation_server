const User = require("../models/User");
const apiResponse = require("../utils/apiResponse");

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile/:id
 * @access  Private
 */
const getProfile = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json(apiResponse(true, "User profile retrieved", user));
  } else {
    res.status(404).json(apiResponse(false, "User not found"));
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
    user.gender = req.body.gender || user.gender;
    user.phone = req.body.phone || user.phone;
    user.city = req.body.city || user.city;
    user.district = req.body.district || user.district;
    user.country = req.body.country || user.country;
    user.lastDonation = req.body.lastDonation || user.lastDonation;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json(apiResponse(true, "Profile updated successfully", updatedUser));
  } else {
    res.status(404).json(apiResponse(false, "User not found"));
  }
};

/**
 * @desc    Toggle donor availability
 * @route   PATCH /api/users/toggle-availability
 * @access  Private/Donor
 */
const toggleAvailability = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.isAvailable = !user.isAvailable;
    await user.save();
    res.json(
      apiResponse(
        true,
        `Availability set to ${user.isAvailable ? "Available" : "Unavailable"}`,
        { isAvailable: user.isAvailable },
      ),
    );
  } else {
    res.status(404).json(apiResponse(false, "User not found"));
  }
};

/**
 * @desc    Get nearby donors
 * @route   GET /api/users/nearby-donors
 * @access  Private
 */
const getNearbyDonors = async (req, res) => {
  const {
    bloodGroup,
    city,
    district,
    country,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {
    role: "donor",
    isAvailable: true,
  };

  if (bloodGroup) {
    query.bloodGroup = bloodGroup;
  }

  if (city) {
    query.city = { $regex: city, $options: "i" };
  }

  if (district) {
    query.district = { $regex: district, $options: "i" };
  }

  if (country) {
    query.country = { $regex: country, $options: "i" };
  }

  try {
    const donors = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.countDocuments(query);

    res.json(
      apiResponse(true, "Nearby donors found", {
        donors,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      }),
    );
  } catch (err) {
    res.status(500).json(apiResponse(false, "Server Error"));
  }
};

module.exports = {
  getProfile,
  updateProfile,
  toggleAvailability,
  getNearbyDonors,
};
