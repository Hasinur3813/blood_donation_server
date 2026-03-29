const express = require('express');
const router = express.Router();
const {
  logDonation,
  getMyHistory,
  getAllDonations,
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router
  .route('/')
  .post(protect, authorize('donor', 'admin'), logDonation)
  .get(protect, authorize('admin'), getAllDonations);

router.get('/my-history', protect, authorize('donor'), getMyHistory);

module.exports = router;
