const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const apiResponse = require("../utils/apiResponse");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  const {
    fullName,
    email,
    password,
    gender,
    bloodGroup,
    phone,
    city,
    district,
    country,
    lastDonation,
    agreedToTerms,
    role,
  } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res
      .status(400)
      .json(apiResponse(false, "User already exists with this email"));
  }

  // Calculate totalDonations based on lastDonation
  const calculatedTotalDonations =
    typeof lastDonation === "string" && lastDonation.trim() !== "" ? 1 : 0;
  const lastDonationDate =
    typeof lastDonation === "string" && lastDonation.trim() !== ""
      ? lastDonation
      : null;

  const user = await User.create({
    fullName,
    email,
    password,
    gender,
    bloodGroup,
    phone,
    city,
    district,
    country,
    lastDonation: lastDonationDate,
    totalDonations: calculatedTotalDonations,
    agreedToTerms,
    role: role || "donor",
  });

  if (user) {
    const token = generateToken(user._id);
    res.status(201).json(
      apiResponse(true, "User registered successfully", {
        user: {
          id: user._id,
          name: user.fullName,
          email: user.email,
          avatar: user.avatar || "",
          phone: user.phone,
          bloodGroup: user.bloodGroup,
          gender: user.gender,
          role: user.role,
          verified: true,
          city: user.city,
          district: user.district,
          country: user.country,
          totalDonations: user.totalDonations,
          memberSince: user.createdAt,
        },
        accessToken: token,
        refreshToken: token,
      }),
    );
  } else {
    res.status(400).json(apiResponse(false, "Invalid user data"));
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    res.json(
      apiResponse(true, "Login successful", {
        user: {
          id: user._id,
          name: user.fullName,
          email: user.email,
          avatar: user.avatar || "",
          phone: user.phone,
          bloodGroup: user.bloodGroup,
          gender: user.gender,
          role: user.role,
          verified: true,
          city: user.city,
          district: user.district,
          country: user.country,
          totalDonations: user.totalDonations,
          memberSince: user.createdAt,
        },
        accessToken: token,
        refreshToken: token,
      }),
    );
  } else {
    res.status(401).json(apiResponse(false, "Invalid email or password"));
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
    res.json(
      apiResponse(true, "User profile retrieved", {
        id: user._id,
        name: user.fullName,
        email: user.email,
        avatar: user.avatar || "",
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        gender: user.gender,
        role: user.role,
        verified: true,
        city: user.city,
        district: user.district,
        country: user.country,
        totalDonations: user.totalDonations,
        memberSince: user.createdAt,
      }),
    );
  } else {
    res.status(404).json(apiResponse(false, "User not found"));
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  res.json(apiResponse(true, "User logged out successfully"));
};

/**
 * @desc    Send password reset token to user email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    // Do not reveal whether email exists
    return res.json(
      apiResponse(true, "If a user exists, an email has been sent."),
    );
  }

  const crypto = require("crypto");
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetExpire = Date.now() + 60 * 60 * 1000; // 1 hour

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = resetExpire;
  await user.save({ validateBeforeSave: false });

  // In a real app, send this token by email. For now return in response for quick dev.
  return res.json(
    apiResponse(true, "Password reset token generated", {
      resetToken,
      expiresIn: 3600,
    }),
  );
};

/**
 * @desc    Reset password using token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res
      .status(400)
      .json(apiResponse(false, "Token and new password are required."));
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    return res
      .status(400)
      .json(apiResponse(false, "Invalid or expired token."));
  }

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();

  return res.json(apiResponse(true, "Password successfully reset."));
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
};
