const authService = require("../services/authService");
const userService = require("../services/userService");

const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    res.status(err.message.includes("Not Found") ? 404 : 400).json({
      success: false,
      message: err.message,
    });
  });
};

exports.register = asyncHandler(async (req, res) => {
  // Normalizes the schema field mismatch requirement
  const normalizedData = {
    ...req.body,
    email: req.body.emailId || req.body.email
  };
  const user = await authService.registerUser(normalizedData);
  res.status(201).json({
    success: true,
    message: "User Registered Successfully",
    user,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const emailTarget = req.body.emailId || req.body.email;
  const result = await authService.loginUser(emailTarget, req.body.password);
  res.status(200).json({
    success: true,
    ...result,
  });
});

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserDetailsById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await userService.mutateSelfProfile(req.user.id, req.body.name, req.body.phone);
  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user: updatedUser,
  });
});

exports.deleteProfile = asyncHandler(async (req, res) => {
  await userService.removeUserRecord(req.user.id);
  res.status(200).json({
    success: true,
    message: "Account Deleted Successfully",
  });
});