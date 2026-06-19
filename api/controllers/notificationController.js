const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

exports.getNotifications = asyncHandler(async (req, res) => {
  const { portal } = req.query;
  const filter = { recipient: req.user._id };

  if (portal) {
    filter.portal = { $in: [portal, 'general'] };
  }

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json(new ApiResponse(200, notifications));
});

exports.markRead = asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { read: true },
  );
  res
    .status(200)
    .json(new ApiResponse(200, null, 'Notification marked as read'));
});

exports.markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { read: true },
  );
  res
    .status(200)
    .json(new ApiResponse(200, null, 'All notifications marked as read'));
});

exports.deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id,
  });
  res.status(200).json(new ApiResponse(200, null, 'Notification deleted'));
});

exports.clearAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ recipient: req.user._id });
  res.status(200).json(new ApiResponse(200, null, 'All notifications cleared'));
});
