const User = require("../models/User");

class UserService {
  // Read Master Users List (Excludes sensitive password hashes)
  async getAllUsersMaster() {
    return await User.find().select("-password");
  }

  // Read Single Profile Entity Details
  async getUserDetailsById(id) {
    const user = await User.findById(id).select("-password");
    if (!user) throw new Error("User Not Found");
    return user;
  }

  // Administrative Resource Patch Mutations
  async adminModifyUser(id, payload) {
    const updated = await User.findByIdAndUpdate(
      id,
      {
        name: payload.name,
        emailId: payload.emailId || payload.email, // Standardizes field fallbacks
        phone: payload.phone,
        role: payload.role,
      },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!updated) throw new Error("User Not Found");
    return updated;
  }

  // Account Purge Drops
  async removeUserRecord(id) {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) throw new Error("User Not Found");
    return true;
  }

  // Individual Self-Profile Context Modifications
  async mutateSelfProfile(id, name, phone) {
    const user = await User.findById(id);
    if (!user) throw new Error("User Not Found");

    if (name) user.name = name;
    if (phone) user.phone = phone;

    return await user.save();
  }
}

module.exports = new UserService();