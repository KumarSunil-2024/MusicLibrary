const express = require("express");
const router = express.Router();

// Import authentication and authorization middleware layers
const { protect, admin } = require("../middleware/authMiddleware");

// Import target controller business logic
const {
  getSongs,
  getAllSongs,
  getSongById,
  updateSong,
  deleteSong,
  toggleVisibility,
} = require("../controllers/songController");

const { adminAddSong } = require("../controllers/adminController");

/* ==========================================================================
   1. STANDARD USER ROUTING INDEX (Requires a valid login token)
   ========================================================================== */

// GET /api/songs -> Fetch standard visible catalog items
router.get("/", protect, getSongs);

// GET /api/songs/:id -> View detailed data for a specific song asset
router.get("/:id", protect, getSongById);


/* ==========================================================================
   2. ADMINISTRATIVE MANAGEMENT OPERATIONS (Requires Admin role clearance)
   ========================================================================== */

// POST /api/songs -> Inject a brand new song record into the database
router.post("/", protect, admin, adminAddSong);

// GET /api/songs/admin/all -> Retrieve full catalog index (including hidden files)
router.get("/admin/all", protect, admin, getAllSongs);

// PUT /api/songs/:id -> Update fields for an existing song registry entry
router.put("/:id", protect, admin, updateSong);

// PUT /api/songs/:id/visibility -> Toggle public/private access tags
router.put("/:id/visibility", protect, admin, toggleVisibility);

// DELETE /api/songs/:id -> Safely drop a record permanently from the database
router.delete("/:id", protect, admin, deleteSong);

module.exports = router;