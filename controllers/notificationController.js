const Notification = require('../models/Notification');
const apiResponse = require('../utils/apiResponse');

/**
 * @desc    Get all notifications for a user
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });

  res.json(apiResponse(true, 'Notifications retrieved', notifications));
};

/**
 * @desc    Mark a notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json(apiResponse(false, 'Not authorized to update this notification'));
    }

    notification.isRead = true;
    const updatedNotification = await notification.save();
    res.json(
      apiResponse(true, 'Notification marked as read', updatedNotification)
    );
  } else {
    res.status(404).json(apiResponse(false, 'Notification not found'));
  }
};

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json(apiResponse(false, 'Not authorized to delete this notification'));
    }

    await notification.deleteOne();
    res.json(apiResponse(true, 'Notification removed'));
  } else {
    res.status(404).json(apiResponse(false, 'Notification not found'));
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification,
};
