const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const admin = require("../middleware/adminMiddleware");

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");

router.get("/users", protect, admin, getUsers);

router.get("/users/:id", protect, admin, getUser);

router.put("/users/:id", protect, admin, updateUser);

router.delete("/users/:id", protect, admin, deleteUser);

module.exports = router;
