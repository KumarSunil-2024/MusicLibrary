const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");

// Browser test route
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Auth Routes Working",
  });
});

// Browser test route
router.get("/register", (req, res) => {
  res.send("Use POST /api/auth/register");
});

// Browser test route
router.get("/login", (req, res) => {
  res.send("Use POST /api/auth/login");
});

// Actual APIs
router.post("/register", register);
router.post("/login", login);

module.exports = router;
