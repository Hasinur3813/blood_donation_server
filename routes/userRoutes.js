const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  toggleAvailability,
  getNearbyDonors,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/profile/:id', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.patch(
  '/toggle-availability',
  protect,
  authorize('donor', 'admin'),
  toggleAvailability
);
router.get('/nearby-donors', protect, getNearbyDonors);

module.exports = router;
