const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");

// 🎯 FIXED: Direct safe import of the entire controller object to avoid destructured undefined crashes
const adminController = require("../controllers/adminController");

// ==========================================
// 👥 USER MANAGEMENT CHANNELS
// ==========================================

// If a function doesn't exist yet, we use a fallback anonymous function to prevent server crashes
router.get("/users", protect, admin, adminController.getUsers || ((req, res) => res.json([])));
router.get("/users/:id", protect, admin, adminController.getUser || ((req, res) => res.json({})));
router.put("/users/:id", protect, admin, adminController.updateUser || ((req, res) => res.json({})));
router.delete("/users/:id", protect, admin, adminController.deleteUser || ((req, res) => res.json({})));

// ==========================================
// 🎵 SONG & NOTIFICATION DIRECT GATEWAYS
// ==========================================
router.post("/songs", protect, admin, adminController.adminAddSong);

module.exports = router;