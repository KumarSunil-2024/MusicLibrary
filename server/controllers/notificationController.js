const notificationService = require("../services/notificationService");

const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    res.status(500).json({ success: false, message: err.message });
  });
};

// Exposes a GET route handler for client dashboard lists
exports.getNotifications = asyncHandler(async (req, res) => {
  const list = await notificationService.getAllNotifications();
  res.json(list);
});