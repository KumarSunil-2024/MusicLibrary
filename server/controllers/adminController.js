const Song = require("../models/Song");
const adminService = require("../services/adminService");
const userService = require("../services/userService");

// Unified Async Error Handler Wrapper
const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error("🚨 Controller execution failure:", err.message);
    res.status(500).json({ success: false, message: err.message });
  });
};

/* ==========================================================================
   1. CATALOG & LIVE BROADCAST OPERATIONS
   ========================================================================== */

// POST /api/admin/songs -> Adds a song and fires a live socket alert
exports.adminAddSong = asyncHandler(async (req, res) => {
  console.log("📥 Processing song upload payload:", req.body);
  
  const adminId = req.user?.id || null;

  // Delegate business logic completely to the AdminService layer
  const song = await adminService.addSongAndNotify(req.body, adminId);

  res.status(201).json({ 
    success: true, 
    message: "Song cataloged and broadcast successfully",
    song 
  });
});

// PUT /api/admin/songs/:id -> Modifies song metadata fields
exports.adminUpdateSong = asyncHandler(async (req, res) => {
  const updatedSong = await adminService.updateLibrarySong(req.params.id, req.body);
  res.json({ success: true, song: updatedSong });
});

// DELETE /api/admin/songs/:id -> Drops a song permanently from the database
exports.adminDeleteSong = asyncHandler(async (req, res) => {
  await adminService.deleteLibrarySong(req.params.id);
  res.json({ success: true, message: "Song removed from database" });
});


/* ==========================================================================
   2. SYSTEM USER ACCOUNT MANAGEMENT (Delegates to UserService)
   ========================================================================== */

// GET /api/admin/users -> Fetch full list of profiles (Excludes passwords)
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsersMaster();
  res.json(users);
});

// GET /api/admin/users/:id -> Read a specific profile entity
exports.getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserDetailsById(req.params.id);
  res.json(user);
});

// PUT /api/admin/users/:id -> Modify an account profile node
exports.updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userService.adminModifyUser(req.params.id, req.body);
  res.json(updatedUser);
});

// DELETE /api/admin/users/:id -> Purge an account permanently
exports.deleteUser = asyncHandler(async (req, res) => {
  await userService.removeUserRecord(req.params.id);
  res.json({ success: true, message: "User profile purged successfully" });
});