const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. REGISTRATION SERVICE: Handles user creation and password hashing
const registerUser = async (data) => {
  if (!data?.email || !data?.password) {
    throw new Error("Missing required registration fields");
  }

  // Check if a user account with this email address already exists
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash the raw password securely before saving it to the database
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Persist the new user record into the database
  const user = await User.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: hashedPassword,
    role: data.role ? data.role.toUpperCase() : "USER", // Normalizes role string casing
  });

  return user;
};

// 2. LOGIN SERVICE: Validates credentials and generates a token session
const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Look up the account by email address
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid Email or Password"); // Unified error message for safety
  }

  // Compare the incoming raw password string with the database hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid Email or Password"); // Unified error message for safety
  }

  // Sign a fresh authorization token package using the environment secret
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d", // Session expires automatically after 24 hours
    },
  );

  return {
    token,
    user,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
