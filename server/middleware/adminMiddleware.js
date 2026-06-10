/**
 * Admin Middleware
 * Check admin role
 */

const admin = (req, res, next) => {
  // Authorization middleware

  if (!req.user || req.user.role !== "ADMIN") {
    // Verify admin role

    return res.status(403).json({
      success: false,
      message: "Admin Required",
    });
    // Access denied
  }

  next();
  // Allow access
};

module.exports = admin;
// Export middleware
