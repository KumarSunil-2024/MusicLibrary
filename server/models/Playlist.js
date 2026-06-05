const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    songs: [
      {
        trackId: Number,

        trackName: String,

        artistName: String,

        albumName: String,

        artworkUrl: String,

        previewUrl: String,

        releaseDate: String,

        genre: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Playlist",
  playlistSchema
);