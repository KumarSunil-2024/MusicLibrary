const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    songName: {
      type: String,
      required: true
    },
    singer: {
      type: String,
      required: true
    },
    albumName: {
      type: String,
      required: true
    },
    musicDirector: {
      type: String,
      required: true
    },
    songUrl: {
      type: String,
      required: true
    },

    // 🔄 FIXED: Renamed to match your JSON payload exactly!
    image: {
      type: String,
      default: "" 
    },

    visibility: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Song", songSchema);