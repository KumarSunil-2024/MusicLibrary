const Notification = require("../models/Notification");

class NotificationService {
  async createSongNotification(song, adminId) {
    try {
      const titleText = "New Song Added";
      const messageText = `🎵 New Release: "${song.songName}" by ${song.singer} is now available!`;
      
      // 🎯 FORCE VALIDATION ALIGNMENT: Explicitly saves fields to match your schema file exactly
      const newNotification = await Notification.create({
        title: titleText,
        message: messageText,
        songId: song._id,
        createdBy: adminId || null
      });

      console.log("💾 DATABASE VERIFICATION: Notification written to MongoDB Compass! ID:", newNotification._id);

      // Live WebSockets Transmission Trigger
      if (global.io) {
        global.io.emit("new_song_notification", {
          _id: newNotification._id,
          title: newNotification.title,
          message: newNotification.message,
          createdAt: newNotification.createdAt
        });
        console.log("⚡ SOCKETS VERIFICATION: Broadcast pushed out across network stream successfully.");
      }

      return newNotification;
    } catch (error) {
      console.error("🚨 CRITICAL ERROR WRITING NOTIFICATION TO DATABASE:", error.message);
    }
  }

  async getAllNotifications() {
    return await Notification.find().sort({ createdAt: -1 }).limit(20);
  }
}

module.exports = new NotificationService();