const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  registerValidator,
  loginValidator,
} = require('../utils/validators');

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
