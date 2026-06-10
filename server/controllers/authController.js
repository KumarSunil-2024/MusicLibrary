const authService = require("../services/authService");
// IMPORT AUTH SERVICE

const userService = require("../services/userService");
// IMPORT USER SERVICE

// ASYNC WRAPPER ERROR CATCHER
const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    let statusCode = 400;

    // DYNAMIC STATUS CODE ROUTING
    if (err.message.includes("Not Found")) statusCode = 404;
    else if (err.message.includes("already exists")) statusCode = 409;

    res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  });
};

// REGISTER NEW ACCOUNT MIDDLEWARE
exports.register = asyncHandler(async (req, res) => {
  const normalizedData = {
    ...req.body,
    email: req.body.email || req.body.emailId,
  };

  const user = await authService.registerUser(normalizedData);
  res.status(201).json({
    success: true,
    message: "User Registered Successfully",
    user,
  });
});

// INITIALIZE USER LOGIN MIDDLEWARE
exports.login = asyncHandler(async (req, res) => {
  const emailTarget = req.body.email || req.body.emailId;

  const result = await authService.loginUser(emailTarget, req.body.password);
  res.status(200).json({
    success: true,
    token: result.token,
    user: result.user,
  });
});

// FETCH CURRENT USER PROFILE
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserDetailsById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// UPDATE CLIENT REGISTERED METADATA
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

// PURGE OWNER PROFILE REGISTRY
exports.deleteProfile = asyncHandler(async (req, res) => {
  await userService.removeUserRecord(req.user.id);
  res.status(200).json({
    success: true,
    message: "Account Deleted Successfully",
  });
});