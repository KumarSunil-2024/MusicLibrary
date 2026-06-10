const User = require("../models/User");
// IMPORT USER MODEL

const bcrypt = require("bcryptjs");
// IMPORT BCRYPT PACKAGE

const jwt = require("jsonwebtoken");
// IMPORT JWT PACKAGE

// USER REGISTRATION LOGIC
const registerUser = async (data) => {
  // EXTRACT DYNAMIC REQUEST FIELDS
  const incomingEmail = data?.emailId || data?.email;

  if (!incomingEmail || !data?.password) {
    throw new Error("Missing required registration fields");
  }
  // CHECK REQUIRED FIELDS

  const existingUser = await User.findOne({
    email: incomingEmail,
  });
  // FIND EXISTING USER

  if (existingUser) {
    throw new Error("User already exists");
  }
  // PREVENT DUPLICATE ACCOUNT

  const hashedPassword = await bcrypt.hash(data.password, 10);
  // HASH PASSWORD SECURELY

  const user = await User.create({
    name: data.name,
    email: incomingEmail,
    phone: data.phone,
    password: hashedPassword,
    role: data.role ? data.role.toUpperCase() : "USER",
  });
  // SAVE USER DATA

  return user;
  // RETURN USER OBJECT
};

// USER LOGIN LOGIC
const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  // CHECK LOGIN FIELDS

  const user = await User.findOne({
    email,
  });
  // FIND USER PROFILE

  if (!user) {
    throw new Error("Invalid Email or Password");
  }
  // USER NOT FOUND

  const isMatch = await bcrypt.compare(password, user.password);
  // COMPARE PASSWORD HASHES

  if (!isMatch) {
    throw new Error("Invalid Email or Password");
  }
  // WRONG PASSWORD MATCH

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
  // GENERATE JWT TOKEN

  return {
    token,
    user,
  };
  // RETURN LOGIN DATA
};

module.exports = {
  registerUser,
  loginUser,
};
// EXPORT AUTH FUNCTIONS
