const mongoose = require("mongoose");
// IMPORT MONGOOSE DATABASE

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    songId: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true } // AUTOMATICALLY MANAGES TIMESTAMP FIELDS
);

module.exports = mongoose.model("Notification", notificationSchema);
// EXPORT MONGOOSE MODEL