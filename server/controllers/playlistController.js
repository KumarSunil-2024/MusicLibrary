const playlistService = require("../services/playlistService");
// Import playlist service

const songService = require("../services/songService");
// Import song service

const asyncHandler = (fn) => (req, res, next) => {
  // Handle async errors

  fn(req, res, next).catch((err) => {
    console.error(err.message);
    // Print error

    res.status(500).json({
      success: false,
      message: err.message,
    });
    // Send error response
  });
};

// Get Playlists
exports.getPlaylists = asyncHandler(async (req, res) => {
  const playlists = await playlistService.getUserPlaylists(req.user.id);
  // Fetch playlists

  res.json(playlists);
  // Return playlists
});

// Create Playlist
exports.createPlaylist = asyncHandler(async (req, res) => {
  const playlist = await playlistService.createNewPlaylist(
    req.body.name,
    req.user.id,
  );
  // Create playlist

  res.status(201).json(playlist);
  // Return playlist
});

// Update Playlist
exports.updatePlaylist = asyncHandler(async (req, res) => {
  const updated = await playlistService.updatePlaylistTitle(
    req.params.id,
    req.body.name,
  );
  // Rename playlist

  res.json(updated);
  // Return playlist
});

// Delete Playlist
exports.deletePlaylist = asyncHandler(async (req, res) => {
  await playlistService.removePlaylistById(req.params.id);
  // Delete playlist

  res.json({
    success: true,
    message: "Playlist Deleted",
  });
  // Send response
});

// Add Song
exports.addSong = asyncHandler(async (req, res) => {
  const updated = await playlistService.pushSongToCollection(
    req.params.id,
    req.body.songId,
  );
  // Add song

  res.json(updated);
  // Return playlist
});

// Remove Song
exports.removeSong = asyncHandler(async (req, res) => {
  const updated = await playlistService.pullSongFromCollection(
    req.params.id,
    req.params.songId,
  );
  // Remove song

  res.json(updated);
  // Return playlist
});

// Add iTunes Song
exports.addItunesSong = asyncHandler(async (req, res) => {
  const trackArtwork =
    req.body.image ||
    req.body.artworkUrl100 ||
    req.body.artworkUrl ||
    "/default-music.png";
  // Get artwork

  const nameString =
    req.body.songName ||
    req.body.songTitle ||
    req.body.trackName ||
    "Untitled Track";
  // Get song name

  const albumString =
    req.body.albumName ||
    req.body.albumTitle ||
    req.body.collectionName ||
    "Single";
  // Get album name

  const normalizedItunesPayload = {
    ...req.body,
    trackName: nameString,
    albumName: albumString,
    artworkUrl: trackArtwork,
    trackId:
      Number(req.body.trackId) || Math.floor(100000 + Math.random() * 900000),
    releaseDate: req.body.releaseDate
      ? String(req.body.releaseDate)
      : new Date().toISOString(),
  };
  // Prepare song data

  const updatedPlaylist = await playlistService.pushSongToCollection(
    req.params.id,
    normalizedItunesPayload,
  );
  // Add iTunes song

  res.json({
    success: true,
    playlist: updatedPlaylist,
  });
  // Return playlist
});

// Get All Songs
exports.getAllSongs = asyncHandler(async (req, res) => {
  const songs = await songService.getVisibleSongs();
  // Fetch songs

  res.json(songs);
  // Return songs
});
