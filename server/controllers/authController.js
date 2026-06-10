const authService = require("../services/authService");
// Import auth service

const userService = require("../services/userService");
// Import user service

const asyncHandler = (fn) => (req, res, next) => {
  // Handle async errors

  fn(req, res, next).catch((err) => {
    // Catch errors

    let statusCode = 400;
    // Default status code

    if (err.message.includes("Not Found")) statusCode = 404;
    // Resource not found
    else if (err.message.includes("already exists")) statusCode = 409;
    // Duplicate record

    res.status(statusCode).json({
      success: false,
      message: err.message,
    });
    // Send error response
  });
};

// Register User
exports.register = asyncHandler(async (req, res) => {
  const normalizedData = {
    ...req.body,
    email: req.body.email || req.body.emailId,
  };
  // Normalize email field

  const user = await authService.registerUser(normalizedData);
  // Create user

  res.status(201).json({
    success: true,
    message: "User Registered Successfully",
    user,
  });
  // Send success response
});

// Login User
exports.login = asyncHandler(async (req, res) => {
  const emailTarget = req.body.email || req.body.emailId;
  // Get email

  const result = await authService.loginUser(emailTarget, req.body.password);
  // Verify credentials

  res.status(200).json({
    success: true,
    token: result.token,
    user: result.user,
  });
  // Return token
});

// Get Profile
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserDetailsById(req.user.id);
  // Get user profile

  res.status(200).json({
    success: true,
    user,
  });
  // Send profile
});

// Update Profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await userService.mutateSelfProfile(
    req.user.id,
    req.body.name,
    req.body.phone,
  );
  // Update profile

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user: updatedUser,
  });
  // Send updated data
});

// Delete Profile
exports.deleteProfile = asyncHandler(async (req, res) => {
  await userService.removeUserRecord(req.user.id);
  // Delete account

  res.status(200).json({
    success: true,
    message: "Account Deleted Successfully",
  });
  // Send success response
});
