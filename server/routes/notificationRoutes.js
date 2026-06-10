const express = require("express");
// IMPORT EXPRESS FRAMEWORK

const router = express.Router();
// INITIALIZE ROUTER INSTANCE

const { protect } = require("../middleware/authMiddleware");
// IMPORT AUTHENTICATION MIDDLEWARE

const { getNotifications } = require("../controllers/notificationController");
// IMPORT NOTIFICATION CONTROLLER

// ROUTE DISTRIBUTION INCOMING GET
router.get("/", protect, getNotifications);

module.exports = router;
// EXPORT SYSTEM ROUTER
