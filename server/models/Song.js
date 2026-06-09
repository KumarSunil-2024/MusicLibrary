const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    // Base field (made flexible so older entries don't fail validation)
    songName: {
      type: String,
      default: ""
    },
    // Legacy database key fallback support
    songTitle: {
      type: String,
      default: ""
    },

    singer: {
      type: String,
      required: true
    },

    // Base field 
    albumName: {
      type: String,
      default: ""
    },
    // Legacy database key fallback support
    albumTitle: {
      type: String,
      default: ""
    },

    musicDirector: {
      type: String,
      required: true
    },
    songUrl: {
      type: String,
      required: true
    },
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