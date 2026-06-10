const jwt = require("jsonwebtoken");
// IMPORT JWT PACKAGE

// SECURE PROTECT PATHS MIDDLEWARE
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // FIX: UPDATED STRING TO RESOLVE JEST TEST SUITE FAILURE
    return res.status(401).json({
      success: false,
      message: "Access Denied: No Token Provided",
    });
  }

  try {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
    // EXTRACT TOKEN STRING

    if (!token) {
      // FIX: MATCHES ACCESS DENIED CONSTRAINTS FOR MISSING TOKENS
      return res.status(401).json({
        success: false,
        message: "Access Denied: Token Missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // VERIFY TOKENS HASH

    req.user = {
      id: decoded.id || decoded._id,
      role: decoded.role ? decoded.role.toUpperCase() : "USER",
    };
    // ATTACH USER IDENTIFICATION

    next();
    // CONTINUE NEXT MIDDLEWARE
  } catch (error) {
    console.error(error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
    // REJECT MALFORMED TOKENS
  }
};

// AUTHORIZE ADMINISTRATIVE PRIVILEGES MIDDLEWARE
const admin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admin Required",
    });
  }
  // CHECK ADMIN ROLE

  next();
  // PERMIT DOWNSTREAM EXECUTION
};

module.exports = {
  protect,
  admin,
};
// EXPORT SYSTEM MIDDLEWARES
