const Song = require("../models/Song");
// Import Song model

const adminService = require("../services/adminService");
// Import admin service

const userService = require("../services/userService");
// Import user service

const asyncHandler = (fn) => (req, res, next) => {
  // Handle async errors

  fn(req, res, next).catch((err) => {
    // Catch errors

    console.error(err.message);
    // Print error

    res.status(500).json({
      success: false,
      message: err.message,
    });
    // Send error response
  });
};

// Add Song
exports.adminAddSong = asyncHandler(async (req, res) => {
  const adminId = req.user?.id || null;
  // Get admin ID

  const song = await adminService.addSongAndNotify(req.body, adminId);
  // Save song

  res.status(201).json({
    success: true,
    message: "Song added successfully",
    song,
  });
  // Send response
});

// Update Song
exports.adminUpdateSong = asyncHandler(async (req, res) => {
  const updatedSong = await adminService.updateLibrarySong(
    req.params.id,
    req.body,
  );
  // Update song

  res.json({
    success: true,
    song: updatedSong,
  });
  // Return song
});

// Delete Song
exports.adminDeleteSong = asyncHandler(async (req, res) => {
  await adminService.deleteLibrarySong(req.params.id);
  // Delete song

  res.json({
    success: true,
    message: "Song deleted",
  });
  // Send response
});

// Get Users
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsersMaster();
  // Fetch users

  res.json(users);
  // Return users
});

// Get Single User
exports.getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserDetailsById(req.params.id);
  // Find user

  res.json(user);
  // Return user
});

// Update User
exports.updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userService.adminModifyUser(
    req.params.id,
    req.body,
  );
  // Update user

  res.json(updatedUser);
  // Return updated user
});

// Delete User
exports.deleteUser = asyncHandler(async (req, res) => {
  await userService.removeUserRecord(req.params.id);
  // Delete user

  res.json({
    success: true,
    message: "User deleted",
  });
  // Send response
});
