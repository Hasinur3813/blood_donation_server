const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile/:id
 * @access  Private
 */
const getProfile = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json(apiResponse(true, 'User profile retrieved', user));
  } else {
    res.status(404).json(apiResponse(false, 'User not found'));
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
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bloodType = req.body.bloodType || user.bloodType;
    user.location = req.body.location || user.location;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json(apiResponse(true, 'Profile updated successfully', updatedUser));
  } else {
    res.status(404).json(apiResponse(false, 'User not found'));
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
        `Availability set to ${user.isAvailable ? 'Available' : 'Unavailable'}`,
        { isAvailable: user.isAvailable }
      )
    );
  } else {
    res.status(404).json(apiResponse(false, 'User not found'));
  }
};

/**
 * @desc    Get nearby donors
 * @route   GET /api/users/nearby-donors
 * @access  Private
 */
const getNearbyDonors = async (req, res) => {
  const { bloodType, location } = req.query;

  const query = {
    role: 'donor',
    isAvailable: true,
  };

  if (bloodType) {
    query.bloodType = bloodType;
  }

  if (location) {
    // Basic regex search for location string
    query.location = { $regex: location, $options: 'i' };
  }

  const donors = await User.find(query);

  res.json(apiResponse(true, 'Nearby donors found', donors));
};

module.exports = {
  getProfile,
  updateProfile,
  toggleAvailability,
  getNearbyDonors,
};
