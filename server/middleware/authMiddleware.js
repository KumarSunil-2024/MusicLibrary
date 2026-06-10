const jwt = require("jsonwebtoken");
// Import JWT package

const protect = async (req, res, next) => {
  // Authentication middleware

  const authHeader = req.headers.authorization;
  // Get token header

  if (!authHeader) {
    // Check token exists

    return res.status(401).json({
      success: false,
      message: "No Token Provided",
    });
    // Access denied
  }

  try {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
    // Extract token

    if (!token) {
      // Check token

      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
      // Access denied
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Verify JWT

    req.user = {
      id: decoded.id || decoded._id,
      role: decoded.role ? decoded.role.toUpperCase() : "USER",
    };
    // Store user data

    next();
    // Go next middleware
  } catch (error) {
    console.error(error.message);
    // Print error

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
    // Authentication failed
  }
};

const admin = (req, res, next) => {
  // Authorization middleware

  if (!req.user || req.user.role !== "ADMIN") {
    // Check admin role

    return res.status(403).json({
      success: false,
      message: "Admin Required",
    });
    // Access denied
  }

  next();
  // Allow access
};

module.exports = {
  protect,
  admin,
};
// Export middleware
