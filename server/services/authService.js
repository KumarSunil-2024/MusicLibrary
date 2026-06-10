const User = require("../models/User");
// Import User model

const bcrypt = require("bcryptjs");
// Import bcrypt package

const jwt = require("jsonwebtoken");
// Import JWT package

// User Registration
const registerUser = async (data) => {
  if (!data?.email || !data?.password) {
    throw new Error("Missing required registration fields");
  }
  // Check required fields

  const existingUser = await User.findOne({
    email: data.email,
  });
  // Find existing user

  if (existingUser) {
    throw new Error("User already exists");
  }
  // Prevent duplicate account

  const hashedPassword = await bcrypt.hash(data.password, 10);
  // Hash password

  const user = await User.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: hashedPassword,
    role: data.role ? data.role.toUpperCase() : "USER",
  });
  // Save user data

  return user;
  // Return user
};

// User Login
const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  // Check login fields

  const user = await User.findOne({
    email,
  });
  // Find user

  if (!user) {
    throw new Error("Invalid Email or Password");
  }
  // User not found

  const isMatch = await bcrypt.compare(password, user.password);
  // Compare passwords

  if (!isMatch) {
    throw new Error("Invalid Email or Password");
  }
  // Wrong password

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  // Generate JWT token

  return {
    token,
    user,
  };
  // Return login data
};

module.exports = {
  registerUser,
  loginUser,
};
// Export functions
