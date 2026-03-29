const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequests,
  getRequestById,
  updateStatus,
  deleteRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const { donationRequestValidator } = require('../utils/validators');

router
  .route('/')
  .post(protect, donationRequestValidator, createRequest)
  .get(protect, getRequests);

router
  .route('/:id')
  .get(protect, getRequestById)
  .delete(protect, deleteRequest);

router.patch('/:id/status', protect, updateStatus);

module.exports = router;
