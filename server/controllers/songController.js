const songService = require("../services/songService");

// Unified Async Error Handler Wrapper
const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error(`🚨 Song module API error [${req.method} ${req.originalUrl}]:`, err.message);
    res.status(500).json({ success: false, message: err.message });
  });
};

/* ==========================================================================
   1. CORE MUSIC CATALOG RECORD MUTATIONS
   ========================================================================== */

// POST /api/songs -> Create a brand new catalog song item entry
exports.createSong = asyncHandler(async (req, res) => {
  const song = await songService.createNewSong(req.body);
  res.status(201).json({ success: true, song });
});

// PUT /api/songs/:id -> Update fields for an existing song record metadata node
exports.updateSong = asyncHandler(async (req, res) => {
  const updatedSong = await songService.updateSongById(req.params.id, req.body);
  res.json({ success: true, song: updatedSong });
});

// DELETE /api/songs/:id -> Purge a song record permanently from the database
exports.deleteSong = asyncHandler(async (req, res) => {
  await songService.removeSongFromDb(req.params.id);
  res.json({ success: true, message: "Song Deleted Successfully" });
});


/* ==========================================================================
   2. PUBLIC & ADMINISTRATIVE INDEX READS
   ========================================================================== */

// GET /api/songs -> Fetch standard visible catalog items for clients
exports.getSongs = asyncHandler(async (req, res) => {
  const songs = await songService.getVisibleSongs();
  res.json(songs);
});

// GET /api/songs/admin/all -> Retrieve full catalog index (including hidden files)
exports.getAllSongs = asyncHandler(async (req, res) => {
  const songs = await songService.getAllSongsMaster();
  res.json(songs);
});

// GET /api/songs/:id -> View detailed data for a specific song asset
exports.getSongById = asyncHandler(async (req, res) => {
  const song = await songService.getSongDetails(req.params.id);
  res.json(song);
});


/* ==========================================================================
   3. VISIBILITY STATE CONTROLS
   ========================================================================== */

// PUT /api/songs/:id/visibility -> Toggle public/private visibility access tags
exports.toggleVisibility = asyncHandler(async (req, res) => {
  const song = await songService.toggleSongVisibilityState(req.params.id);
  res.json({ 
    success: true, 
    message: "Visibility Updated Successfully", 
    visibility: song.visibility, 
    song 
  });
});