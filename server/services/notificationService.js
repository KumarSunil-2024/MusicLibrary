const Notification = require("../models/Notification");

class NotificationService {
  // 1. BROADCAST ALERT: Saves notification record and fires WebSocket stream event
  async createSongNotification(song, adminId) {
    // Basic data guard layer
    if (!song?._id || !song?.songName) {
      throw new Error("Missing mandatory song metadata parameters for alert payload");
    }

    try {
      const titleText = "New Song Added";
      const messageText = `🎵 New Release: "${song.songName}" by ${song.singer || "Unknown Artist"} is now available!`;
      
      // Explicitly map inputs to ensure strict schema compliance
      const newNotification = await Notification.create({
        title: titleText,
        message: messageText,
        songId: song._id,
        createdBy: adminId || null
      });

      console.log("💾 Notification persisted in database with ID:", newNotification._id);

      // 2. LIVE EMIT PIPELINE (Protected from external stream failures)
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
      throw error; // Re-throw error so parenting services are contextually aware
    }
  }

  // 3. FETCH RECENT LOG INDEX: Pulls last 20 public notifications
  async getAllNotifications() {
    return await Notification.find().sort({ createdAt: -1 }).limit(20);
  }
}

// Export a single initialized instance of the service class
module.exports = new NotificationService();