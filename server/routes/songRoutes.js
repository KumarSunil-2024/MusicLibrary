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

// 1. Static Core Route Maps (Put these on top!)
router.get("/", getSongs);
router.post("/", createSong);
router.get("/admin/all", getAllSongs); // Now processes safely without getting blocked!

// 2. Dynamic Wildcard Catch-All Routes (Put these on the bottom)
router.get("/:id", getSongById);
router.put("/:id", updateSong);
router.put("/:id/visibility", toggleVisibility);
router.delete("/:id", deleteSong);

module.exports = router;