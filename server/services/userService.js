const User = require("../models/User");

class UserService {
  // 1. MASTER READ: Fetches all users (Excludes sensitive password hashes)
  async getAllUsersMaster() {
    return await User.find().select("-password");
  }

  // 2. SINGLE PROFILE READ: Fetches user details by explicit ID
  async getUserDetailsById(id) {
    if (!id) throw new Error("User identifier required");
    
    const user = await User.findById(id).select("-password");
    if (!user) throw new Error("User Not Found");
    return user;
  }

  // 3. ADMIN MUTATION ACTION: Allows administrators to modify full profile nodes
  async adminModifyUser(id, payload) {
    if (!id || !payload) {
      throw new Error("Missing profile identifier or modification data");
    }

    // Explicitly parse incoming attributes to prevent unintended updates
    const updatedFields = {
      name: payload.name,
      email: payload.email || payload.emailId, // Fixed field assignment mapping logic
      phone: payload.phone,
      role: payload.role ? payload.role.toUpperCase() : "USER" // Normalizes string case
    };

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true, runValidators: true } // Runs validation guards on parameters
    ).select("-password");
    
    if (!updated) throw new Error("User Not Found");
    return updated;
  }

  // 4. PURGE DROP: Drops an account record permanently from the database
  async removeUserRecord(id) {
    if (!id) throw new Error("User identifier required");

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) throw new Error("User Not Found");
    return true;
  }

  // 5. CLIENT SELF-MUTATION: Handles individual self-profile updates
  async mutateSelfProfile(id, name, phone) {
    if (!id) throw new Error("User identifier required");

    const user = await User.findById(id);
    if (!user) throw new Error("User Not Found");

    // Conditionally re-assign updated attributes
    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();

    const savedUser = await user.save();
    
    // Convert object to strip password hash from being sent back to client layout
    const userObject = savedUser.toObject();
    delete userObject.password;
    
    return userObject;
  }
}

// Export a single initialized instance of the service class
module.exports = new UserService();