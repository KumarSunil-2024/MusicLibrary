const express = require("express");
const router = express.Router();

// Import the security token protection middleware layer
const { protect } = require("../middleware/authMiddleware");

// Import the specific playlist handling controller methods
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

/* ==========================================================================
   1. CORE PLAYLIST CRUD OPERATIONS (Requires a valid login token)
   ========================================================================== */

// POST /api/playlists -> Instantiate a brand new playlist record
router.post("/", protect, createPlaylist);

// GET /api/playlists -> Fetch all custom playlists owned by the active user
router.get("/", protect, getPlaylists);

// PUT /api/playlists/:id -> Modify properties (like renaming) an existing playlist
router.put("/:id", protect, updatePlaylist);

// DELETE /api/playlists/:id -> Drop a playlist row completely from the database
router.delete("/:id", protect, deletePlaylist);


/* ==========================================================================
   2. NESTED TRACK INTEGRATION CONTROLS (Alters items inside a playlist)
   ========================================================================== */

// PUT /api/playlists/:id/add-song -> Append a local database track into a playlist
router.put("/:id/add-song", protect, addSong);

// PUT /api/playlists/:id/add-itunes-song -> Append store song item
router.put("/:id/add-itunes-song", protect, addItunesSong);

// PUT /api/playlists/:id/remove-song/:songId -> Detach a song from a playlist registry
router.put("/:id/remove-song/:songId", protect, removeSong);


/* ==========================================================================
   3. CATALOG DISCOVERY SEARCH ROUTE
   ========================================================================== */

// GET /api/playlists/songs/all -> Fetch accessible public library songs to add
router.get("/songs/all", protect, getAllSongs);

module.exports = router;