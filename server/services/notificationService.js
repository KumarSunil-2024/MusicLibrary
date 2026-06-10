const Notification = require("../models/Notification");
// IMPORT NOTIFICATION MODEL

class NotificationService {
  
  // BROADCAST FRESH TRACK ALERT
  async createSongNotification(song, adminId) {
    if (!song?._id || !song?.songName) {
      throw new Error("Missing mandatory song metadata parameters for alert payload");
    }
    // CHECK REQUIRED METADATA

    try {
      const titleText = "New Song Added";
      const messageText = `🎵 New Release: "${song.songName}" by ${song.singer || "Unknown Artist"} is now available!`;
      
      const newNotification = await Notification.create({
        title: titleText,
        message: messageText,
        songId: song._id,
        createdBy: adminId || null
      });

      console.log("💾 Notification persisted in database with ID:", newNotification._id);

      // WEBSOCKET REAL-TIME DISPATCH PIPELINE
      if (global.io) {
        try {
          global.io.emit("new_song_notification", {
            _id: newNotification._id,
            title: newNotification.title,
            message: newNotification.message,
            createdAt: newNotification.createdAt
          });
          console.log("⚡ Real-time WebSocket broadcast transmitted successfully.");
        } catch (socketError) {
          console.error("⚠️ Sockets Broadcast dropped out, database entry remains intact:", socketError.message);
        }
      }

      return newNotification;
    } catch (error) {
      console.error("🚨 Critical database notification write failure:", error.message);
      throw error; 
    }
  }

  // PULL RECENT NOTIFICATION ENTRIES
  async getAllNotifications() {
    // FETCH PERSISTENT NOTIFICATION RECORDS
    return await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(); // LEAN SPEEDS UP READ-ONLY EXECUTION
  }
}

module.exports = new NotificationService();
// EXPORT SYSTEM SERVICE