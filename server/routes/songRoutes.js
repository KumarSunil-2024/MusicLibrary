const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware"); // 🎯 FIXED: Imports your middleware guards
const {
  createSong,
  getSongs,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
  toggleVisibility,
} = require("../controllers/songController");

// 1. Core User Discovery Actions (Open to logged-in accounts)
router.get("/", protect, getSongs);
router.get("/:id", protect, getSongById);

// 2. Core Admin Administration Framework Rules (Strictly locked by role check flags)
router.post("/", protect, admin, createSong);
router.get("/admin/all", protect, admin, getAllSongs); // 🎯 FIXED: No longer vulnerable to standard user snooping
router.put("/:id", protect, admin, updateSong);
router.put("/:id/visibility", protect, admin, toggleVisibility); // 🎯 FIXED: Securely protected toggle
router.delete("/:id", protect, admin, deleteSong);

module.exports = router;