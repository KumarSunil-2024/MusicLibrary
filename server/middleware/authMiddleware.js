const jwt = require("jsonwebtoken");

// 1. Guard Layer: Authenticates Token Streams and attaches Identity
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access Denied: No Token Provided",
    });
  }

  try {
    // Gracefully handles both raw tokens and formatted Bearer strings
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Binds the decoupled session payload straight onto the active request thread
    req.user = {
      id: decoded.id || decoded._id,
      role: decoded.role ? decoded.role.toUpperCase() : "USER" // Normalizes case discrepancies
    };

    next();
  } catch (error) {
    console.error("🚨 JWT VERIFICATION ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentication Failed: Session Invalid or Expired",
    });
  }
};

// 2. Role Verification Layer: Restricts Administrative Endpoints
const admin = (req, res, next) => {
  // 🎯 FIXED: Re-inserted defensive checking to prevent unauthenticated server crashes
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access Denied: Administrative Clearance Required",
    });
  }
  next();
};

// 🎯 FIXED: Single, unified export block preventing object overwrites
module.exports = { 
  protect, 
  admin 
};