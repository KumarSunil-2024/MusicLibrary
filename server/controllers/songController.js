const songService = require("../services/songService");
// IMPORT SONG SERVICE

// ASYNC WRAPPER ERROR CATCHER
const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  });
};

// CREATE FRESH CATALOGUE ITEM
exports.createSong = asyncHandler(async (req, res) => {
  const song = await songService.createNewSong(req.body);
  res.status(201).json({
    success: true,
    song,
  });
});

// UPDATE TRACK RECORD METADATA
exports.updateSong = asyncHandler(async (req, res) => {
  const updatedSong = await songService.updateSongById(req.params.id, req.body);
  res.json({
    success: true,
    song: updatedSong,
  });
});

// PURGE TRACK FROM DATABASE
exports.deleteSong = asyncHandler(async (req, res) => {
  await songService.removeSongFromDb(req.params.id);
  res.json({
    success: true,
    message: "Song Deleted Successfully",
  });
});

// GET PUBLIC TRACK RECORDS
exports.getSongs = asyncHandler(async (req, res) => {
  const songs = await songService.getVisibleSongs();
  res.json(songs);
});

// GET MASTER SYSTEM CATALOGUE
exports.getAllSongs = asyncHandler(async (req, res) => {
  const songs = await songService.getAllSongsMaster();
  res.json(songs);
});

// PULL SPECIFIC TRACK DETAILS
exports.getSongById = asyncHandler(async (req, res) => {
  const song = await songService.getSongDetails(req.params.id);
  res.json(song);
});

// TOGGLE TRACK VISIBILITY RULES
exports.toggleVisibility = asyncHandler(async (req, res) => {
  const song = await songService.toggleSongVisibilityState(req.params.id);
  res.json({
    success: true,
    message: "Visibility Updated Successfully",
    visibility: song.visibility,
    song,
  });
});