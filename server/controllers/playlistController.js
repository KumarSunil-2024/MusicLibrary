const playlistService = require("../services/playlistService");
const songService = require("../services/songService");

// ASYNC WRAPPER ERROR CATCHER
const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error("🚨 Controller caught an unhandled service error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  });
};

// GET USER PLAYLISTS MIDDLEWARE
exports.getPlaylists = asyncHandler(async (req, res) => {
  const playlists = await playlistService.getUserPlaylists(req.user.id);
  res.json(playlists);
});

// CREATE PLAYLIST RECORD MIDDLEWARE
exports.createPlaylist = asyncHandler(async (req, res) => {
  const playlist = await playlistService.createNewPlaylist(
    req.body.name,
    req.user.id
  );
  res.status(201).json(playlist);
});

// UPDATE PLAYLIST TITLE MIDDLEWARE
exports.updatePlaylist = asyncHandler(async (req, res) => {
  const updated = await playlistService.updatePlaylistTitle(
    req.params.id,
    req.body.name
  );
  res.json(updated);
});

// DELETE PLAYLIST INSTANCE MIDDLEWARE
exports.deletePlaylist = asyncHandler(async (req, res) => {
  await playlistService.removePlaylistById(req.params.id);
  res.json({
    success: true,
    message: "Playlist Deleted",
  });
});

// ADD INTERNAL DATABASE TRACK
exports.addSong = asyncHandler(async (req, res) => {
  const updated = await playlistService.pushSongToCollection(
    req.params.id,
    req.body.songId
  );
  res.json(updated);
});

// REMOVE TRACK FROM SUBCOLLECTION
exports.removeSong = asyncHandler(async (req, res) => {
  const updated = await playlistService.pullSongFromCollection(
    req.params.id,
    req.params.songId
  );
  res.json(updated);
});

// ADD ITUNES METADATA TRACK
exports.addItunesSong = asyncHandler(async (req, res) => {
  // NORMALIZING IMAGE KEY FALLBACKS
  const trackArtwork =
    req.body.image ||
    req.body.artworkUrl100 ||
    req.body.artworkUrl ||
    "/default-music.png";

  // NORMALIZING TITLE KEY FALLBACKS
  const nameString =
    req.body.songName ||
    req.body.songTitle ||
    req.body.trackName ||
    "Untitled Track";

  // NORMALIZING ALBUM KEY FALLBACKS
  const albumString =
    req.body.albumName ||
    req.body.albumTitle ||
    req.body.collectionName ||
    "Single";

  // DATA TRANSFER OBJECT CLEANUP
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

  const updatedPlaylist = await playlistService.pushItunesSongToCollection(
    req.params.id,
    normalizedItunesPayload
  );

  res.json({
    success: true,
    playlist: updatedPlaylist,
  });
});

// GET PUBLIC TRACK RECORDS
exports.getAllSongs = asyncHandler(async (req, res) => {
  const songs = await songService.getVisibleSongs();
  res.json(songs);
});