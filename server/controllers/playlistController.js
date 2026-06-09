const playlistService = require("../services/playlistService");
const songService = require("../services/songService");

// Unified Async Error Handler Wrapper
const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error("🚨 Playlist controller execution failure:", err.message);
    res.status(500).json({ success: false, message: err.message });
  });
};

/* ==========================================================================
   1. PLAYLIST DOCUMENT CRUD OPERATIONS
   ========================================================================== */

// GET /api/playlists -> Fetch all custom playlists owned by the active user
exports.getPlaylists = asyncHandler(async (req, res) => {
  const playlists = await playlistService.getUserPlaylists(req.user.id);
  res.json(playlists);
});

// POST /api/playlists -> Instantiate a brand new playlist record
exports.createPlaylist = asyncHandler(async (req, res) => {
  const playlist = await playlistService.createNewPlaylist(req.body.name, req.user.id);
  res.status(201).json(playlist);
});

// PUT /api/playlists/:id -> Rename a playlist title
exports.updatePlaylist = asyncHandler(async (req, res) => {
  const updated = await playlistService.updatePlaylistTitle(req.params.id, req.body.name);
  res.json(updated);
});

// DELETE /api/playlists/:id -> Drop a playlist row completely from the database
exports.deletePlaylist = asyncHandler(async (req, res) => {
  await playlistService.removePlaylistById(req.params.id);
  res.json({ success: true, message: "Playlist Deleted" });
});


/* ==========================================================================
   2. NESTED TRACK INTEGRATION CONTROLS
   ========================================================================== */

// PUT /api/playlists/:id/add-song -> Append a local database track into a playlist
exports.addSong = asyncHandler(async (req, res) => {
  const updated = await playlistService.pushSongToCollection(req.params.id, req.body.songId);
  res.json(updated);
});

// PUT /api/playlists/:id/remove-song/:songId -> Detach a song from a playlist registry
exports.removeSong = asyncHandler(async (req, res) => {
  const updated = await playlistService.pullSongFromCollection(req.params.id, req.params.songId);
  res.json(updated);
});

// PUT /api/playlists/:id/add-itunes-song -> Append an external iTunes store song item
exports.addItunesSong = asyncHandler(async (req, res) => {
  // Normalize fields cleanly before saving to prevent schema definition errors
  const trackArtwork = req.body.image || req.body.artworkUrl100 || req.body.artworkUrl || "/default-music.png";
  const nameString = req.body.songName || req.body.songTitle || req.body.trackName || "Untitled Track";
  const albumString = req.body.albumName || req.body.albumTitle || req.body.collectionName || "Single";

  const normalizedItunesPayload = {
    ...req.body,
    trackName: nameString,
    albumName: albumString,
    artworkUrl: trackArtwork,
    trackId: Number(req.body.trackId) || Math.floor(100000 + Math.random() * 900000),
    releaseDate: req.body.releaseDate ? String(req.body.releaseDate) : new Date().toISOString(),
  };

  // 🛠️ BUG FIX: Redirect through playlistService instead of calling a missing direct model reference
  const updatedPlaylist = await playlistService.pushSongToCollection(req.params.id, normalizedItunesPayload);
  
  res.json({ success: true, playlist: updatedPlaylist });
});


/* ==========================================================================
   3. BACKUP GLOBAL MUSIC DISCOVERY PULLS
   ========================================================================== */

// GET /api/playlists/songs/all -> Fetch accessible public library songs to add
exports.getAllSongs = asyncHandler(async (req, res) => {
  const songs = await songService.getVisibleSongs();
  res.json(songs);
});