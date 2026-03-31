const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { registerValidator, loginValidator } = require("../utils/validators");

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;
