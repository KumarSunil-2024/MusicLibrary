const express = require("express");
// Import Express framework

const router = express.Router();
// Create route object

const { protect, admin } = require("../middleware/authMiddleware");
// Import security checks

const adminController = require("../controllers/adminController");
// Import admin functions

// GET /api/admin/users
router.get("/users", protect, admin, adminController.getUsers);
// Get all users

// GET /api/admin/users/:id
router.get("/users/:id", protect, admin, adminController.getUser);
// Get single user

// PUT /api/admin/users/:id
router.put("/users/:id", protect, admin, adminController.updateUser);
// Update user details

// DELETE /api/admin/users/:id
router.delete("/users/:id", protect, admin, adminController.deleteUser);
// Delete user account

// POST /api/admin/songs
router.post("/songs", protect, admin, adminController.adminAddSong);
// Add new song

module.exports = router;
// Export router object
