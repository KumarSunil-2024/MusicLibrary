const User = require("../models/User");
// Import User model

class UserService {
  // User service class

  async getAllUsersMaster() {
    // Get all users

    return await User.find().select("-password");
    // Exclude password
  }

  async getUserDetailsById(id) {
    // Get user details

    if (!id) {
      // Check user ID
      throw new Error("User identifier required");
    }

    const user = await User.findById(id).select("-password");
    // Find user

    if (!user) {
      // User not found
      throw new Error("User Not Found");
    }

    return user;
    // Return user data
  }

  async adminModifyUser(id, payload) {
    // Update user

    if (!id || !payload) {
      // Check inputs
      throw new Error("Missing data");
    }

    const updatedFields = {
      name: payload.name,
      email: payload.email || payload.emailId,
      phone: payload.phone,
      role: payload.role ? payload.role.toUpperCase() : "USER",
    };
    // Prepare update data

    const updated = await User.findByIdAndUpdate(
      id,
      {
        $set: updatedFields,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");
    // Update user

    if (!updated) {
      // User not found
      throw new Error("User Not Found");
    }

    return updated;
    // Return updated user
  }

  async removeUserRecord(id) {
    // Delete user

    if (!id) {
      // Check user ID
      throw new Error("User identifier required");
    }

    const deleted = await User.findByIdAndDelete(id);
    // Delete user

    if (!deleted) {
      // User not found
      throw new Error("User Not Found");
    }

    return true;
    // Success response
  }

  async mutateSelfProfile(id, name, phone) {
    // Update own profile

    if (!id) {
      // Check user ID
      throw new Error("User identifier required");
    }

    const user = await User.findById(id);
    // Find user

    if (!user) {
      // User not found
      throw new Error("User Not Found");
    }

    if (name) {
      // Update name
      user.name = name.trim();
    }

    if (phone) {
      // Update phone
      user.phone = phone.trim();
    }

    const savedUser = await user.save();
    // Save changes

    const userObject = savedUser.toObject();
    // Convert object

    delete userObject.password;
    // Remove password

    return userObject;
    // Return user data
  }
}

module.exports = new UserService();
// Export service
