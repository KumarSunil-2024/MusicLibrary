const notificationService = require("../services/notificationService");
// IMPORT NOTIFICATION SERVICE

// ASYNC WRAPPER ERROR CATCHER
const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error(`🚨 Notification module API error [${req.method} ${req.originalUrl}]:`, err.message);
    res.status(500).json({ success: false, message: err.message });
  });
};

// EXPOSE NOTIFICATION FEED API
exports.getNotifications = asyncHandler(async (req, res) => {
  // PULL RECENT HISTORICAL RECORDS
  const notificationsList = await notificationService.getAllNotifications();
  
  // SEND FEED ARRAY DIRECTLY
  res.json(notificationsList || []);
});