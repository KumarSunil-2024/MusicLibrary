const songService = require("../services/songService");

// 🎯 FIXED: Fully unified asynchronous handler with standard next validation pipelines
const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error(`🚨 SONG MODULE API ERROR [${req.method} ${req.originalUrl}]:`, err.message);
    res.status(500).json({ success: false, message: err.message });
  });
};

exports.createSong = asyncHandler(async (req, res) => {
  const song = await songService.createNewSong(req.body);
  res.status(201).json(song);
});

exports.updateSong = asyncHandler(async (req, res) => {
  const updatedSong = await songService.updateSongById(req.params.id, req.body);
  res.json(updatedSong);
});

exports.getSongs = asyncHandler(async (req, res) => {
  const songs = await songService.getVisibleSongs();
  res.json(songs);
});

exports.getAllSongs = asyncHandler(async (req, res) => {
  const songs = await songService.getAllSongsMaster();
  res.json(songs);
});

exports.getSongById = asyncHandler(async (req, res) => {
  const song = await songService.getSongDetails(req.params.id);
  res.json(song);
});

exports.deleteSong = asyncHandler(async (req, res) => {
  await songService.removeSongFromDb(req.params.id);
  res.json({ message: "Song Deleted Successfully" });
});

exports.toggleVisibility = asyncHandler(async (req, res) => {
  const song = await songService.toggleSongVisibilityState(req.params.id);
  res.json({ message: "Visibility Updated", visibility: song.visibility, song });
});