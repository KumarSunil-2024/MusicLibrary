const userService = require("../services/userService");

const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  });
};

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsersMaster();
  res.json(users);
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserDetailsById(req.params.id);
  res.json(user);
});

exports.updateUser = asyncHandler(async (req, res) => {
  const user = await userService.adminModifyUser(req.params.id, req.body);
  res.json(user);
});

exports.deleteUser = asyncHandler(async (req, res) => {
  await userService.removeUserRecord(req.params.id);
  res.json({
    success: true,
    message: "User Deleted Successfully",
  });
});