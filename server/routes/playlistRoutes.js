const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createPlaylist,
  getPlaylists,
  deletePlaylist,
  addSong,
  removeSong,
  updatePlaylist,
  getAllSongs,
  addItunesSong,
} = require("../controllers/playlistController");

router.post("/", protect, createPlaylist);

router.get("/", protect, getPlaylists);

router.delete("/:id", protect, deletePlaylist);

router.put("/:id/add-song", protect, addSong);

router.put("/:id/remove-song/:songId", protect, removeSong);
router.put("/:id/add-itunes-song", protect, addItunesSong);
router.put("/:id", protect, updatePlaylist);
router.get("/songs/all", protect, getAllSongs);
module.exports = router;
