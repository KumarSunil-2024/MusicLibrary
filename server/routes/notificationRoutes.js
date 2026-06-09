const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getNotifications } = require("../controllers/notificationController");

// Securely open to any valid logged-in user account session
router.get("/", protect, getNotifications);

module.exports = router;