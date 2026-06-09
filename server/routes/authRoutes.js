const express = require("express");
const router = express.Router();

// Import the security token protection middleware layer
const { protect } = require("../middleware/authMiddleware");

// Import target authentication controller business logic
const {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/authController");

/* ==========================================================================
   1. DIAGNOSTIC API HEARTBEAT
   ========================================================================== */

// GET /api/auth -> Simple network verification diagnostic health check
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Auth API Gateway Operational",
  });
});

/* ==========================================================================
   2. PUBLIC AUTHCESS GATEWAYS (Open to unauthenticated traffic)
   ========================================================================== */

// POST /api/auth/register -> Process entry details and commit new account records
router.post("/register", register);

// POST /api/auth/login -> Verify login credentials and exchange for signed JWT session
router.post("/login", login);

/* ==========================================================================
   3. PRIVATE PROFILE SUITE (Requires a valid login token verification)
   ========================================================================== */

// GET /api/auth/profile -> Fetch logged-in user profile details
router.get("/profile", protect, getProfile);

// PUT /api/auth/profile -> Modify properties on the current user identity node
router.put("/profile", protect, updateProfile);

// DELETE /api/auth/profile -> Permanently purge the active profile registry context
router.delete("/profile", protect, deleteProfile);

module.exports = router;
