const Song = require("../models/Song");
const notificationService = require("./notificationService"); 

class AdminService {
  // 🎯 FIXED: Receives the adminId argument from the controller request session
  async addSongAndNotify(songData, adminId) {
    // 1. Save track into the global database
    const song = await Song.create({ ...songData, visibility: true });

    // 2. Trigger notification with required schema signatures
    await notificationService.createSongNotification(song, adminId);

    return song;
  }

  async updateLibrarySong(id, updateData) {
    const updated = await Song.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: "after", runValidators: true });
    if (!updated) throw new Error("Song Not Found");
    return updated;
  }

  async deleteLibrarySong(id) {
    const deleted = await Song.findByIdAndDelete(id);
    if (!deleted) throw new Error("Song Not Found");
    return deleted;
  }
}

module.exports = new AdminService();