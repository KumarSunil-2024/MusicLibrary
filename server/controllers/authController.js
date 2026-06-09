const authService = require("../services/authService");
const userService = require("../services/userService");

// Unified Async Error Handler Wrapper (With clean HTTP mapping rules)
const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    // Determine context-appropriate HTTP status code
    let statusCode = 400; // Bad Request fallback
    if (err.message.includes("Not Found")) statusCode = 404;
    else if (err.message.includes("already exists")) statusCode = 409; // Conflict

    res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  });
};

/* ==========================================================================
   1. REGISTRATION & SESSION MANAGEMENT (Delegates to AuthService)
   ========================================================================== */

// POST /api/auth/register -> Creates an account with normalized data attributes
exports.register = asyncHandler(async (req, res) => {
  // Gracefully handles both frontend email parameter names
  const normalizedData = {
    ...req.body,
    email: req.body.email || req.body.emailId
  };

  const user = await authService.registerUser(normalizedData);
  
  res.status(201).json({
    success: true,
    message: "User Registered Successfully",
    user,
  });
});

// POST /api/auth/login -> Validates credentials and returns signed JWT strings
exports.login = asyncHandler(async (req, res) => {
  const emailTarget = req.body.email || req.body.emailId;
  
  const result = await authService.loginUser(emailTarget, req.body.password);
  
  res.status(200).json({
    success: true,
    token: result.token,
    user: result.user
  });
});


/* ==========================================================================
   2. INDIVIDUAL CLIENT SELF PROFILE MANAGEMENT (Delegates to UserService)
   ========================================================================== */

// GET /api/auth/profile -> Reads active user record (Excludes password hash)
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserDetailsById(req.user.id);
  
  res.status(200).json({
    success: true,
    user,
  });
});

// PUT /api/auth/profile -> Modifies editable profile details (Name, Phone)
exports.updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await userService.mutateSelfProfile(
    req.user.id, 
    req.body.name, 
    req.body.phone
  );
  
  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user: updatedUser,
  });
});

// DELETE /api/auth/profile -> Allows active member to purge their account context
exports.deleteProfile = asyncHandler(async (req, res) => {
  await userService.removeUserRecord(req.user.id);
  
  res.status(200).json({
    success: true,
    message: "Account Deleted Successfully",
  });
});