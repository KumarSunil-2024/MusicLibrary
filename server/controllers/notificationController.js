const notificationService = require("../services/notificationService");

// Unified Async Error Handler Wrapper
const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error(`🚨 Notification module API error [${req.method} ${req.originalUrl}]:`, err.message);
    res.status(500).json({ success: false, message: err.message });
  });
};

/* ==========================================================================
   1. REAL-TIME ALERTS LOG READS
   ========================================================================== */

// GET /api/notifications -> Exposes an endpoint for client dashboard notification feeds
exports.getNotifications = asyncHandler(async (req, res) => {
  // Pull persistent logs from database layer
  const notificationsList = await notificationService.getAllNotifications();
  
  // Return standard array format directly to user feed layouts
  res.json(notificationsList);
});