const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/authController");

// Test

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Auth Routes Working",
  });
});

// Auth

router.post("/register", register);

router.post("/login", login);

// Profile

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.delete("/profile", protect, deleteProfile);

module.exports = router;
