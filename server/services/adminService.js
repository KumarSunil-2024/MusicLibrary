const Song = require("../models/Song");
// IMPORT SONG MODEL

const notificationService = require("./notificationService");
// IMPORT NOTIFICATION SERVICE

class AdminService {
  // ADD SONG AND NOTIFY
  async addSongAndNotify(songData, adminId) {
    if (!songData?.songName || !songData?.songUrl) {
      throw new Error("Missing mandatory track metadata fields");
    }
    // CHECK REQUIRED METADATA

    const song = await Song.create({
      ...songData,
      visibility: true,
    });
    // SAVE SONG DOCUMENT

    try {
      await notificationService.createSongNotification(song, adminId);
    } catch (notificationError) {
      console.error("Notification Error:", notificationError.message);
    }
    // TRIGGER BACKGROUND NOTIFICATIONS

    return song;
    // RETURN SONG DATA
  }

  // UPDATE LIBRARY TRACK DETAILS
  async updateLibrarySong(id, updateData) {
    if (!id || !updateData) {
      throw new Error("Missing data");
    }
    // CHECK DATA REQUISITES

    const updated = await Song.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
    // UPDATE SONG COLLECTION

    if (!updated) {
      throw new Error("Song Not Found");
    }
    // VERIFY DATABASE WRITE

    return updated;
    // RETURN UPDATED SONG
  }

  // PURGE TRACK FROM LIBRARY
  async deleteLibrarySong(id) {
    if (!id) {
      throw new Error("Target record identifier required");
    }
    // CHECK TRACK ID

    const deleted = await Song.findByIdAndDelete(id);
    // REMOVE DOCUMENT INSTANCE

    if (!deleted) {
      throw new Error("Song Not Found");
    }
    // VERIFY REMOVAL OPERATION

    return deleted;
    // RETURN DEL RECORD
  }
}

module.exports = new AdminService();
// EXPORT ADMIN SERVICE
