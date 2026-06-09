const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
const {
  getSongs,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
  toggleVisibility,
} = require("../controllers/songController");

// 🎯 MINIMAL FIX: Import the notification-enabled handler from your admin controller
const { adminAddSong } = require("../controllers/adminController");

// 1. Core User Discovery Actions (Open to logged-in accounts)
router.get("/", protect, getSongs);
router.get("/:id", protect, getSongById);

// 2. Core Admin Administration Framework Rules
// 🎯 MINIMAL FIX: Swapped out 'createSong' for 'adminAddSong'
router.post("/", protect, admin, adminAddSong);

router.get("/admin/all", protect, admin, getAllSongs);
router.put("/:id", protect, admin, updateSong);
router.put("/:id/visibility", protect, admin, toggleVisibility);
router.delete("/:id", protect, admin, deleteSong);

module.exports = router;