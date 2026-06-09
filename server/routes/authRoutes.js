const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/authController");

// Test Diagnostic Route
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Auth Routes Working",
  });
});

// Authentication Access Handlers
router.post("/register", register);
router.post("/login", login);

// User Profile Context
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);

module.exports = router;