const express = require("express");
// Import Express

const router = express.Router();
// Create router

const { protect, admin } = require("../middleware/authMiddleware");
// Import security middleware

const {
  getSongs,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
  toggleVisibility,
} = require("../controllers/songController");
// Import song functions

const { adminAddSong } = require("../controllers/adminController");
// Import add song function

// GET /api/songs
router.get("/", protect, getSongs);
// Get visible songs

// GET /api/songs/:id
router.get("/:id", protect, getSongById);
// Get single song

// POST /api/songs
router.post("/", protect, admin, adminAddSong);
// Add new song

// GET /api/songs/admin/all
router.get("/admin/all", protect, admin, getAllSongs);
// Get all songs

// PUT /api/songs/:id
router.put("/:id", protect, admin, updateSong);
// Update song details

// PUT /api/songs/:id/visibility
router.put("/:id/visibility", protect, admin, toggleVisibility);
// Change visibility

// DELETE /api/songs/:id
router.delete("/:id", protect, admin, deleteSong);
// Delete song

module.exports = router;
// Export router
