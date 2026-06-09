const Song = require("../models/Song");
const Notification = require("../models/Notification");
const userService = require("../services/userService");

const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error("🚨 DATABASE EXECUTION ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  });
};

// ==========================================
// 🎵 CORE SONG & NOTIFICATION WRITER (THE FIX)
// ==========================================
exports.adminAddSong = asyncHandler(async (req, res) => {
  console.log("📥 [1/3] Received song payload from frontend:", req.body);
  
  const { songName, songTitle, singer, albumName, albumTitle, musicDirector, songUrl, image } = req.body;
  const targetTitle = (songName || songTitle || "New Track").trim();

  // 1. Force Write directly to the Songs collection
  const song = await Song.create({
    songName: targetTitle,
    songTitle: targetTitle,
    singer: (singer || "Unknown Artist").trim(),
    albumName: (albumName || albumTitle || "Single").trim(),
    albumTitle: (albumName || albumTitle || "Single").trim(),
    musicDirector: (musicDirector || "Unknown").trim(),
    songUrl: (songUrl || "").trim(),
    image: image || "",
    visibility: true
  });
  console.log("💾 [2/3] Song saved successfully. ID:", song._id);

  // 2. Force Write directly to the Notifications collection matching your exact schema
  const newNotification = await Notification.create({
    title: "New Song Added",
    message: `🎵 New Release: "${targetTitle}" by ${song.singer} is now available!`,
    songId: song._id,
    createdBy: req.user?.id || null
  });
  console.log("📢 [3/3] Notification FORCE WRITTEN to MongoDB. ID:", newNotification._id);

  // 3. Broadcast across real-time WebSockets
  if (global.io) {
    global.io.emit("new_song_notification", {
      _id: newNotification._id,
      title: newNotification.title,
      message: newNotification.message,
      createdAt: newNotification.createdAt
    });
    console.log("⚡ Live WebSocket broadcast emitted.");
  }

  res.status(201).json({ success: true, song, notification: newNotification });
});

// ==========================================
// 👤 USER MANAGEMENT BACKUPS
// ==========================================
exports.getUsers = asyncHandler(async (req, res) => res.json(await userService.getAllUsersMaster()));
exports.getUser = asyncHandler(async (req, res) => res.json(await userService.getUserDetailsById(req.params.id)));
exports.updateUser = asyncHandler(async (req, res) => res.json(await userService.adminModifyUser(req.params.id, req.body)));
exports.deleteUser = asyncHandler(async (req, res) => { await userService.removeUserRecord(req.params.id); res.json({ success: true }); });
exports.adminUpdateSong = asyncHandler(async (req, res) => res.json(await Song.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })));
exports.adminDeleteSong = asyncHandler(async (req, res) => { await Song.findByIdAndDelete(req.params.id); res.json({ success: true }); });