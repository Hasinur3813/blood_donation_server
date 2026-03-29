const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const apiResponse = require('../utils/apiResponse');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  const { name, email, password, role, bloodType, location, phone } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res
      .status(400)
      .json(apiResponse(false, 'User already exists with this email'));
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    bloodType,
    location,
    phone,
  });

  if (user) {
    res.status(201).json(
      apiResponse(true, 'User registered successfully', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bloodType: user.bloodType,
        token: generateToken(user._id),
      })
    );
  } else {
    res.status(400).json(apiResponse(false, 'Invalid user data'));
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json(
      apiResponse(true, 'Login successful', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bloodType: user.bloodType,
        token: generateToken(user._id),
      })
    );
  } else {
    res.status(401).json(apiResponse(false, 'Invalid email or password'));
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json(apiResponse(true, 'User profile retrieved', user));
  } else {
    res.status(404).json(apiResponse(false, 'User not found'));
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  // In JWT, logout is usually handled by client by deleting the token.
  // We can just return a success response.
  res.json(apiResponse(true, 'User logged out successfully'));
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};
