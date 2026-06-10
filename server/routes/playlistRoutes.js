const express = require("express");
// Import Express

const router = express.Router();
// Create router

const { protect } = require("../middleware/authMiddleware");
// Import token check

const {
  createPlaylist,
  getPlaylists,
  deletePlaylist,
  addSong,
  removeSong,
  updatePlaylist,
  getAllSongs,
  addItunesSong,
} = require("../controllers/playlistController");
// Import playlist functions

// POST /api/playlists
router.post("/", protect, createPlaylist);
// Create playlist

// GET /api/playlists
router.get("/", protect, getPlaylists);
// Get all playlists

// PUT /api/playlists/:id
router.put("/:id", protect, updatePlaylist);
// Update playlist

// DELETE /api/playlists/:id
router.delete("/:id", protect, deletePlaylist);
// Delete playlist

// PUT /api/playlists/:id/add-song
router.put("/:id/add-song", protect, addSong);
// Add local song

// PUT /api/playlists/:id/add-itunes-song
router.put("/:id/add-itunes-song", protect, addItunesSong);
// Add iTunes song

// PUT /api/playlists/:id/remove-song/:songId
router.put("/:id/remove-song/:songId", protect, removeSong);
// Remove song

// GET /api/playlists/songs/all
router.get("/songs/all", protect, getAllSongs);
// Get all songs

module.exports = router;
// Export router