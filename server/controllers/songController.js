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

// Create Song
exports.createSong = asyncHandler(async (req, res) => {
  const song = await songService.createNewSong(req.body);
  // Create song

  res.status(201).json({
    success: true,
    song,
  });
  // Return song
});

// Update Song
exports.updateSong = asyncHandler(async (req, res) => {
  const updatedSong = await songService.updateSongById(req.params.id, req.body);
  // Update song

  res.json({
    success: true,
    song: updatedSong,
  });
  // Return updated song
});

// Delete Song
exports.deleteSong = asyncHandler(async (req, res) => {
  await songService.removeSongFromDb(req.params.id);
  // Delete song

  res.json({
    success: true,
    message: "Song Deleted Successfully",
  });
  // Send response
});

// Get Visible Songs
exports.getSongs = asyncHandler(async (req, res) => {
  const songs = await songService.getVisibleSongs();
  // Fetch visible songs

  res.json(songs);
  // Return songs
});

// Get All Songs
exports.getAllSongs = asyncHandler(async (req, res) => {
  const songs = await songService.getAllSongsMaster();
  // Fetch all songs

  res.json(songs);
  // Return songs
});

// Get Song By ID
exports.getSongById = asyncHandler(async (req, res) => {
  const song = await songService.getSongDetails(req.params.id);
  // Find song

  res.json(song);
  // Return song
});

// Toggle Visibility
exports.toggleVisibility = asyncHandler(async (req, res) => {
  const song = await songService.toggleSongVisibilityState(req.params.id);
  // Change visibility

  res.json({
    success: true,
    message: "Visibility Updated Successfully",
    visibility: song.visibility,
    song,
  });
  // Return updated status
});
