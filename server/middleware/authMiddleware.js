const jwt = require("jsonwebtoken");

// 1. AUTHENTICATION LAYER: Validates incoming tokens and binds identity
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if header exists
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access Denied: No Token Provided",
    });
  }

  try {
    // Extract token cleanly whether it uses Bearer format or raw strings
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: Token Missing From Header",
      });
    }

    // Verify token validity using environment secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Bind clean payload parameters explicitly to the request thread
    req.user = {
      id: decoded.id || decoded._id,
      role: decoded.role ? decoded.role.toUpperCase() : "USER",
    };

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentication Failed: Session Invalid or Expired",
    });
  }
};

// 2. AUTHORIZATION LAYER: Restricts routes to Administrator role only
const admin = (req, res, next) => {
  // Defensive check prevents server from crashing if protect middleware was skipped
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access Denied: Administrative Clearance Required",
    });
  }
  
  next();
};

// Export middleware functions as a unified object module
module.exports = { 
  protect, 
  admin 
};