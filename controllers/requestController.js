const DonationRequest = require("../models/DonationRequest");
const apiResponse = require("../utils/apiResponse");

/**
 * @desc    Create a blood donation request
 * @route   POST /api/requests
 * @access  Private
 */
const createRequest = async (req, res) => {
  try {
    const {
      // Patient Information
      patientName,
      patientAge,
      patientGender,
      patientCondition,

      // Blood Requirements
      bloodGroup,
      unitsRequired,
      componentType,

      // Hospital Information
      hospital,
      division,
      district,
      ward,

      // Medical Staff
      doctorName,
      doctorContact,

      // Urgency & Timeline
      urgencyLevel,
      requiredBy,
      requiredByTime,
      specialInstructions,

      // Contact Information
      requesterName,
      relation,
      contactPhone,
      alternatePhone,
      contactEmail,

      // Additional
      notes,
    } = req.body;

    // Validate required fields
    if (
      !patientName ||
      !patientAge ||
      !patientGender ||
      !patientCondition ||
      !bloodGroup ||
      !unitsRequired ||
      !componentType ||
      !hospital ||
      !division ||
      !district ||
      !doctorName ||
      !urgencyLevel ||
      !requiredBy ||
      !requesterName ||
      !relation ||
      !contactPhone
    ) {
      return res
        .status(400)
        .json(apiResponse(false, "All required fields must be provided"));
    }

    // Create the request
    const request = await DonationRequest.create({
      requesterId: req.user._id,

      // Patient Information
      patientName,
      patientAge: parseInt(patientAge),
      patientGender,
      patientCondition,

      // Blood Requirements
      bloodGroup,
      unitsRequired: parseInt(unitsRequired),
      componentType,

      // Hospital Information
      hospital,
      division,
      district,
      ward,

      // Medical Staff
      doctorName,
      doctorContact,

      // Urgency & Timeline
      urgencyLevel,
      requiredBy: new Date(requiredBy),
      requiredByTime,
      specialInstructions,

      // Contact Information
      requesterName,
      relation,
      contactPhone,
      alternatePhone,
      contactEmail,

      // Additional
      notes,
    });

    // Populate requester information
    await request.populate("requesterId", "fullName email phone");

    res
      .status(201)
      .json(
        apiResponse(
          true,
          "Blood donation request created successfully",
          request,
        ),
      );
  } catch (error) {
    console.error("Create request error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json(apiResponse(false, "Validation Error", messages));
    }
    res
      .status(500)
      .json(apiResponse(false, "Failed to create blood donation request"));
  }
};

/**
 * @desc    Get all donation requests with filters
 * @route   GET /api/requests
 * @access  Private
 */
const getRequests = async (req, res) => {
  try {
    const {
      bloodGroup,
      urgencyLevel,
      status = "pending",
      hospital,
      division,
      district,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (urgencyLevel) query.urgencyLevel = urgencyLevel;
    if (status) query.status = status;
    if (hospital) query.hospital = new RegExp(hospital, "i");
    if (division) query.division = division;
    if (district) query.district = new RegExp(district, "i");

    const requests = await DonationRequest.find(query)
      .populate("requesterId", "fullName email phone bloodGroup")
      .populate("matchedDonorId", "fullName email phone bloodGroup")
      .sort({
        createdAt: -1,
        urgencyLevel: -1, // emergency first, then urgent, then normal
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await DonationRequest.countDocuments(query);

    res.json(
      apiResponse(true, "Donation requests retrieved successfully", {
        requests,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalRequests: count,
      }),
    );
  } catch (error) {
    console.error("Get requests error:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to retrieve donation requests"));
  }
};

/**
 * @desc    Get donation request by ID
 * @route   GET /api/requests/:id
 * @access  Private
 */
const getRequestById = async (req, res) => {
  try {
    const request = await DonationRequest.findById(req.params.id)
      .populate("requesterId", "fullName email phone bloodGroup")
      .populate("matchedDonorId", "fullName email phone bloodGroup");

    if (!request) {
      return res
        .status(404)
        .json(apiResponse(false, "Donation request not found"));
    }

    res.json(
      apiResponse(true, "Donation request retrieved successfully", request),
    );
  } catch (error) {
    console.error("Get request error:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to retrieve donation request"));
  }
};

/**
 * @desc    Update donation request status
 * @route   PUT /api/requests/:id
 * @access  Private
 */
const updateStatus = async (req, res) => {
  try {
    const { status, matchedDonorId, notes } = req.body;

    const request = await DonationRequest.findById(req.params.id);

    if (!request) {
      return res
        .status(404)
        .json(apiResponse(false, "Donation request not found"));
    }

    // Check if user owns this request or is admin
    if (
      request.requesterId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json(apiResponse(false, "Not authorized to update this request"));
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (matchedDonorId) updateData.matchedDonorId = matchedDonorId;
    if (notes !== undefined) updateData.notes = notes;

    const updatedRequest = await DonationRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    )
      .populate("requesterId", "fullName email phone bloodGroup")
      .populate("matchedDonorId", "fullName email phone bloodGroup");

    res.json(
      apiResponse(
        true,
        "Donation request updated successfully",
        updatedRequest,
      ),
    );
  } catch (error) {
    console.error("Update request error:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to update donation request"));
  }
};

/**
 * @desc    Delete donation request
 * @route   DELETE /api/requests/:id
 * @access  Private
 */
const deleteRequest = async (req, res) => {
  try {
    const request = await DonationRequest.findById(req.params.id);

    if (!request) {
      return res
        .status(404)
        .json(apiResponse(false, "Donation request not found"));
    }

    // Check if user owns this request or is admin
    if (
      request.requesterId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json(apiResponse(false, "Not authorized to delete this request"));
    }

    await DonationRequest.findByIdAndDelete(req.params.id);

    res.json(apiResponse(true, "Donation request deleted successfully"));
  } catch (error) {
    console.error("Delete request error:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to delete donation request"));
  }
};

/**
 * @desc    Get user's own requests
 * @route   GET /api/requests/my-requests
 * @access  Private
 */
const getMyRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const requests = await DonationRequest.find({ requesterId: req.user._id })
      .populate("matchedDonorId", "fullName email phone bloodGroup")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await DonationRequest.countDocuments({
      requesterId: req.user._id,
    });

    res.json(
      apiResponse(true, "Your requests retrieved successfully", {
        requests,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalRequests: count,
      }),
    );
  } catch (error) {
    console.error("Get my requests error:", error);
    res
      .status(500)
      .json(apiResponse(false, "Failed to retrieve your requests"));
  }
};

module.exports = {
  createRequest,
  getRequests,
  getMyRequests,
  getRequestById,
  updateStatus,
  deleteRequest,
};
//   request.matchedDonorId = matchedDonorId;
// }

//     const updatedRequest = await request.save();
//     res.json(
//       apiResponse(true, "Request status updated successfully", updatedRequest),
//     );
//   } else {
//     res.status(404).json(apiResponse(false, "Request not found"));
//   }
// };

// module.exports = {
//   createRequest,
//   getRequests,
//   getMyRequests,
//   getRequestById,
//   updateStatus,
//   deleteRequest,
// };
