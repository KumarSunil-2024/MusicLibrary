/**
 * Role Verification Layer: Restricts administrative endpoints
 * Ensures it executes sequentially after the primary token verification middleware
 */
const admin = (req, res, next) => {
  // Defensive guard check: Prevents server crashes if the authentication layer was skipped
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access Denied: Administrative Clearance Required",
    });
  }

  next();
};

module.exports = admin;