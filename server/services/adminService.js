const Song = require("../models/Song");
// Import Song model

const notificationService = require("./notificationService");
// Import notification service

class AdminService {
  // Admin service class

  async addSongAndNotify(songData, adminId) {
    // Add new song

    if (!songData?.songName || !songData?.songUrl) {
      // Check required fields
      throw new Error("Missing mandatory track metadata fields");
    }

    const song = await Song.create({
      ...songData,
      visibility: true,
    });
    // Save song

    try {
      await notificationService.createSongNotification(song, adminId);
      // Send notification
    } catch (notificationError) {
      // Handle notification error

      console.error("Notification Error:", notificationError.message);
      // Log error
    }

    return song;
    // Return song data
  }

  async updateLibrarySong(id, updateData) {
    // Update song

    if (!id || !updateData) {
      // Check inputs
      throw new Error("Missing data");
    }

    const updated = await Song.findByIdAndUpdate(
      id,
      {
        $set: updateData,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
    // Update database

    if (!updated) {
      // Song not found
      throw new Error("Song Not Found");
    }

    return updated;
    // Return updated song
  }

  async deleteLibrarySong(id) {
    // Delete song

    if (!id) {
      // Check song ID
      throw new Error("Target record identifier required");
    }

    const deleted = await Song.findByIdAndDelete(id);
    // Delete song

    if (!deleted) {
      // Song not found
      throw new Error("Song Not Found");
    }

    return deleted;
    // Return deleted song
  }
}

module.exports = new AdminService();
// Export service
