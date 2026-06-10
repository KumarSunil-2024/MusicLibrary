const User = require("../models/User");
// IMPORT USER MODEL

class UserService {
  // PULL MASTER PROFILE REGISTRY
  async getAllUsersMaster() {
    return await User.find().select("-password");
    // EXCLUDE PASSWORD FIELD
  }

  // PULL TARGET PROFILE DETAILS
  async getUserDetailsById(id) {
    if (!id) {
      throw new Error("User identifier required");
    }
    // CHECK IDENTIFIER EXISTENCE

    const user = await User.findById(id).select("-password");
    // QUERY PROFILE DATABASE

    if (!user) {
      throw new Error("User Not Found");
    }
    // EVALUATE DOCUMENT EXISTENCE

    return user;
    // RETURN USER RECORD
  }

  // ADMINISTRATIVE DATA MODIFICATION SYSTEM
  async adminModifyUser(id, payload) {
    if (!id || !payload) {
      throw new Error("Missing data");
    }
    // CHECK INPUT CRITERIA

    const updatedFields = {
      name: payload.name,
      email: payload.email || payload.emailId,
      phone: payload.phone,
      role: payload.role ? payload.role.toUpperCase() : "USER",
    };
    // ASSIGN METADATA ATTRIBUTES

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");
    // EXECUTE ATOMIC MODIFICATION

    if (!updated) {
      throw new Error("User Not Found");
    }
    // EVALUATE DATABASE TRANSITION

    return updated;
    // RETURN UPDATED ACCOUNT
  }

  // PURGE PROFILE REGISTRY RECORD
  async removeUserRecord(id) {
    if (!id) {
      throw new Error("User identifier required");
    }
    // CHECK IDENTIFIER TARGET

    const deleted = await User.findByIdAndDelete(id);
    // REMOVE DATABASE DOCUMENT

    if (!deleted) {
      throw new Error("User Not Found");
    }
    // VERIFY MUTATION SUCCESS

    return true;
    // RETURN CONFIRMATION FLAG
  }

  // CLIENT OWNS ACCOUNT EDITING
  async mutateSelfProfile(id, name, phone) {
    if (!id) {
      throw new Error("User identifier required");
    }
    // CHECK SECURITY REFERENCE

    const user = await User.findById(id);
    // QUERY TARGET DOCUMENT

    if (!user) {
      throw new Error("User Not Found");
    }
    // VERIFY PROFILE IDENTITY

    if (name) {
      user.name = name.trim();
    }
    // SANITIZE USER NAME

    if (phone) {
      user.phone = phone.trim();
    }
    // SANITIZE PHONE NUMBER

    const savedUser = await user.save();
    // COMMIT LOCAL REVISIONS

    const userObject = savedUser.toObject();
    // MAP OBJECT REFERENCE

    delete userObject.password;
    // DROP PASSWORD HASH

    return userObject;
    // RETURN SANITIZED MODEL
  }
}

module.exports = new UserService();
// EXPORT USER SERVICE