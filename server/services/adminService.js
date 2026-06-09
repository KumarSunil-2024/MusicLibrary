const Song = require("../models/Song");
const notificationService = require("./notificationService"); 

class AdminService {
  // 1. ADD TRACK: Persists song details and triggers real-time stream broadcast
  async addSongAndNotify(songData, adminId) {
    if (!songData?.songName || !songData?.songUrl) {
      throw new Error("Missing mandatory track metadata fields");
    }

    // Save track into the global database catalog
    const song = await Song.create({ 
      ...songData, 
      visibility: true 
    });

    // Fire live alerts down the socket pipeline to standard users
    try {
      await notificationService.createSongNotification(song, adminId);
    } catch (notificationError) {
      // Log notification failure but do not crash the request if the song saved successfully
      console.error("Delayed Notification Stream dispatch:", notificationError.message);
    }

    return song;
  }

  // 2. AMEND REGISTRY: Modifies fields with runtime validator checks
  async updateLibrarySong(id, updateData) {
    if (!id || !updateData) {
      throw new Error("Target record identifier and modification payload required");
    }

    const updated = await Song.findByIdAndUpdate(
      id, 
      { $set: updateData }, 
      { returnDocument: "after", runValidators: true } // Runs validation constraints on updates
    );

    if (!updated) {
      throw new Error("Song Not Found");
    }

    return updated;
  }

  // 3. DROP TRACK: Safely removes an asset entry from the collection registry
  async deleteLibrarySong(id) {
    if (!id) {
      throw new Error("Target record identifier required");
    }

    const deleted = await Song.findByIdAndDelete(id);
    
    if (!deleted) {
      throw new Error("Song Not Found");
    }

    return deleted;
  }
}

// Export a single initialized instance of the service class
module.exports = new AdminService();