const playlistService = require("../services/playlistService");
const songService = require("../services/songService");

const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error("🚨 Controller caught an unhandled service error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  });
};

// Get Playlists
exports.getPlaylists = asyncHandler(async (req, res) => {
  const playlists = await playlistService.getUserPlaylists(req.user.id);
  res.json(playlists);
});

// Create Playlist
exports.createPlaylist = asyncHandler(async (req, res) => {
  const playlist = await playlistService.createNewPlaylist(
    req.body.name,
    req.user.id
  );
  res.status(201).json(playlist);
});

// Update Playlist
exports.updatePlaylist = asyncHandler(async (req, res) => {
  const updated = await playlistService.updatePlaylistTitle(
    req.params.id,
    req.body.name
  );
  res.json(updated);
});

// Delete Playlist
exports.deletePlaylist = asyncHandler(async (req, res) => {
  await playlistService.removePlaylistById(req.params.id);
  res.json({
    success: true,
    message: "Playlist Deleted",
  });
});

// Add Local Database Song
exports.addSong = asyncHandler(async (req, res) => {
  const updated = await playlistService.pushSongToCollection(
    req.params.id,
    req.body.songId
  );
  res.json(updated);
});

// Remove Song (Handles both iTunes and Local Database tracks now)
exports.removeSong = asyncHandler(async (req, res) => {
  const updated = await playlistService.pullSongFromCollection(
    req.params.id,
    req.params.songId
  );
  res.json(updated);
});

// Add iTunes Song
exports.addItunesSong = asyncHandler(async (req, res) => {
  const trackArtwork =
    req.body.image ||
    req.body.artworkUrl100 ||
    req.body.artworkUrl ||
    "/default-music.png";

  const nameString =
    req.body.songName ||
    req.body.songTitle ||
    req.body.trackName ||
    "Untitled Track";

  const albumString =
    req.body.albumName ||
    req.body.albumTitle ||
    req.body.collectionName ||
    "Single";

  const normalizedItunesPayload = {
    ...req.body,
    trackName: nameString,
    albumName: albumString,
    artworkUrl: trackArtwork,
    trackId: Number(req.body.trackId) || Math.floor(100000 + Math.random() * 900000),
    releaseDate: req.body.releaseDate
      ? String(req.body.releaseDate)
      : new Date().toISOString(),
  };

  // 🎯 FIXED: Directing to pushItunesSongToCollection instead of pushSongToCollection
  const updatedPlaylist = await playlistService.pushItunesSongToCollection(
    req.params.id,
    normalizedItunesPayload
  );

  res.json({
    success: true,
    playlist: updatedPlaylist,
  });
});

// Get All Songs
exports.getAllSongs = asyncHandler(async (req, res) => {
  const songs = await songService.getVisibleSongs();
  res.json(songs);
});