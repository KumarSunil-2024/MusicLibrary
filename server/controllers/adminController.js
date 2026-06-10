const Song = require("../models/Song");
// IMPORT SONG MODEL

const adminService = require("../services/adminService");
// IMPORT ADMIN SERVICE

const userService = require("../services/userService");
// IMPORT USER SERVICE

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

// ADD NEW library TRACK
exports.adminAddSong = asyncHandler(async (req, res) => {
  const adminId = req.user?.id || null;

  // CALLS NOTIFICATION TRIGGER SERVICE
  const song = await adminService.addSongAndNotify(req.body, adminId);

  res.status(201).json({
    success: true,
    message: "Song added successfully",
    song,
  });
});

// UPDATE library TRACK DETAILS
exports.adminUpdateSong = asyncHandler(async (req, res) => {
  const updatedSong = await adminService.updateLibrarySong(
    req.params.id,
    req.body,
  );
  res.json({
    success: true,
    song: updatedSong,
  });
});

// DELETE library TRACK COMPLETELY
exports.adminDeleteSong = asyncHandler(async (req, res) => {
  await adminService.deleteLibrarySong(req.params.id);
  res.json({
    success: true,
    message: "Song deleted",
  });
});

// FETCH ALL USERS MIDDLEWARE
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsersMaster();
  res.json(users);
});

// FETCH SPECIFIC USER DETAIL
exports.getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserDetailsById(req.params.id);
  res.json(user);
});

// ADMINISTRATIVELY EDIT USER PROFILE
exports.updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userService.adminModifyUser(
    req.params.id,
    req.body,
  );
  res.json(updatedUser);
});

// PURGE CHOSEN USER PROFILE
exports.deleteUser = asyncHandler(async (req, res) => {
  await userService.removeUserRecord(req.params.id);
  res.json({
    success: true,
    message: "User deleted",
  });
});
