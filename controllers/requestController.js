const DonationRequest = require('../models/DonationRequest');
const apiResponse = require('../utils/apiResponse');

/**
 * @desc    Create a donation request
 * @route   POST /api/requests
 * @access  Private
 */
const createRequest = async (req, res) => {
  const { bloodType, urgency, location, notes } = req.body;

  const request = await DonationRequest.create({
    requesterId: req.user._id,
    bloodType,
    urgency,
    location,
    notes,
  });

  res.status(201).json(apiResponse(true, 'Donation request created', request));
};

/**
 * @desc    Get all donation requests with filters
 * @route   GET /api/requests
 * @access  Private
 */
const getRequests = async (req, res) => {
  const { bloodType, urgency, status } = req.query;

  const query = {};
  if (bloodType) query.bloodType = bloodType;
  if (urgency) query.urgency = urgency;
  if (status) query.status = status;

  const requests = await DonationRequest.find(query)
    .populate('requesterId', 'name email bloodType phone')
    .sort({ createdAt: -1 });

  res.json(apiResponse(true, 'Donation requests found', requests));
};

/**
 * @desc    Get donation request by ID
 * @route   GET /api/requests/:id
 * @access  Private
 */
const getRequestById = async (req, res) => {
  const request = await DonationRequest.findById(req.params.id)
    .populate('requesterId', 'name email phone')
    .populate('matchedDonorId', 'name email phone');

  if (request) {
    res.json(apiResponse(true, 'Donation request found', request));
  } else {
    res.status(404).json(apiResponse(false, 'Request not found'));
  }
};

/**
 * @desc    Update donation request status
 * @route   PATCH /api/requests/:id/status
 * @access  Private
 */
const updateStatus = async (req, res) => {
  const { status, matchedDonorId } = req.body;

  const request = await DonationRequest.findById(req.params.id);

  if (request) {
    // Only requester or admin can update
    if (
      request.requesterId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json(apiResponse(false, 'Not authorized to update this request'));
    }

    request.status = status || request.status;
    if (matchedDonorId) {
      request.matchedDonorId = matchedDonorId;
    }

    const updatedRequest = await request.save();
    res.json(
      apiResponse(true, 'Request status updated successfully', updatedRequest)
    );
  } else {
    res.status(404).json(apiResponse(false, 'Request not found'));
  }
};

/**
 * @desc    Delete donation request
 * @route   DELETE /api/requests/:id
 * @access  Private
 */
const deleteRequest = async (req, res) => {
  const request = await DonationRequest.findById(req.params.id);

  if (request) {
    // Only requester or admin can delete
    if (
      request.requesterId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json(apiResponse(false, 'Not authorized to delete this request'));
    }

    await request.deleteOne();
    res.json(apiResponse(true, 'Donation request removed'));
  } else {
    res.status(404).json(apiResponse(false, 'Request not found'));
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateStatus,
  deleteRequest,
};
