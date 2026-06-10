const express = require("express");
// Import Express

const router = express.Router();
// Create router

const { protect } = require("../middleware/authMiddleware");
// Import token check

const {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/authController");
// Import controller functions

// GET /api/auth
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Auth API Gateway Operational",
  });
});
// API health check

// POST /api/auth/register
router.post("/register", register);
// Create new account

// POST /api/auth/login
router.post("/login", login);
// User login

// GET /api/auth/profile
router.get("/profile", protect, getProfile);
// View own profile

// PUT /api/auth/profile
router.put("/profile", protect, updateProfile);
// Update profile

// DELETE /api/auth/profile
router.delete("/profile", protect, deleteProfile);
// Delete profile

module.exports = router;
// Export routes
