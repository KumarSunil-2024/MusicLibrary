const express = require("express");

const router = express.Router();

const {
  createSong,
  getSongs,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
  toggleVisibility,
} = require("../controllers/songController");

// User Routes

router.get("/", getSongs);

router.get("/:id", getSongById);

// Admin Routes

router.post("/", createSong);

router.get("/admin/all", getAllSongs);

router.put("/:id", updateSong);

router.put("/:id/visibility", toggleVisibility);

router.delete("/:id", deleteSong);

module.exports = router;
