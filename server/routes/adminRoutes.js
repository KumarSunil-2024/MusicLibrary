const express = require("express");
const router = express.Router();

// Import authentication and authorization middleware layers
const { protect, admin } = require("../middleware/authMiddleware");

// Import the complete admin controller module object
const adminController = require("../controllers/adminController");

/* ==========================================================================
   1. ADMINISTRATIVE USER ACCOUNT REGISTRY MANAGEMENT
   ========================================================================== */

// GET /api/admin/users -> Fetch full list of profiles (Excludes passwords)
router.get("/users", protect, admin, adminController.getUsers);

// GET /api/admin/users/:id -> Read a specific profile entity details
router.get("/users/:id", protect, admin, adminController.getUser);

// PUT /api/admin/users/:id -> Modify an account profile node properties
router.put("/users/:id", protect, admin, adminController.updateUser);

// DELETE /api/admin/users/:id -> Purge an account permanently from the registry
router.delete("/users/:id", protect, admin, adminController.deleteUser);


/* ==========================================================================
   2. SYSTEM CATALOG & BROADCAST OPERATIONS
   ========================================================================== */

// POST /api/admin/songs -> Inject a brand new song and broadcast real-time socket alerts
router.post("/songs", protect, admin, adminController.adminAddSong);

module.exports = router;