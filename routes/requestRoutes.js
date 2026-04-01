const express = require("express");
const router = express.Router();
const {
  createRequest,
  getRequests,
  getRequestById,
  updateStatus,
  deleteRequest,
  getMyRequests,
} = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, createRequest).get(getRequests);

router
  .route("/:id")
  .get(protect, getRequestById)
  .put(protect, updateStatus)
  .delete(protect, deleteRequest);

router.get("/my-requests", protect, getMyRequests);

module.exports = router;
