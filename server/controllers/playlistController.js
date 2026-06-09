const Playlist = require("../models/Playlist");
const Song = require("../models/Song");

// Create Playlist
exports.createPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.create({
      name: req.body.name,
      userId: req.user.id,
    });
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get User Playlists
exports.getPlaylists = async (req, res) => {
  try {
    res.json(await Playlist.find({ userId: req.user.id }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Playlist
exports.deletePlaylist = async (req, res) => {
  try {
    await Playlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Playlist Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Song To Playlist (SHORTENED & ATOMIC)
exports.addSong = async (req, res) => {
  try {
    const song = await Song.findById(req.body.songId);
    if (!song) return res.status(404).json({ message: "Song not found" });

    // Fallback if trackId isn't a native number format
    const trackNum =
      Number(song.trackId) || Math.floor(100000 + Math.random() * 900000);

    const payload = {
      trackId: trackNum,
      trackName: song.songName,
      artistName: song.singer,
      albumName: song.albumName,
      artworkUrl: song.artworkUrl100 || "/default-music.png",
      previewUrl: song.songUrl,
      releaseDate: song.createdAt
        ? song.createdAt.toISOString()
        : new Date().toISOString(),
      genre: song.genre || "General",
    };

    // Atomic push bypasses the old corrupted entries crash issue entirely!
    const updated = await Playlist.findByIdAndUpdate(
      req.params.id,
      { $push: { songs: payload } },
      { new: true, runValidators: true },
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove Song
exports.removeSong = async (req, res) => {
  try {
    const updated = await Playlist.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          songs: {
            $or: [
              { _id: req.params.songId },
              { trackId: Number(req.params.songId) || 0 },
            ],
          },
        },
      },
      { new: true },
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rename Playlist
exports.updatePlaylist = async (req, res) => {
  try {
    res.json(
      await Playlist.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true },
      ),
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Songs
exports.getAllSongs = async (req, res) => {
  try {
    res.json(await Song.find());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add iTunes Song
exports.addItunesSong = async (req, res) => {
  try {
    const updated = await Playlist.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          songs: {
            ...req.body,
            trackId: Number(req.body.trackId) || 0,
            releaseDate: String(req.body.releaseDate || ""),
          },
        },
      },
      { new: true },
    );
    res.json({ success: true, playlist: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
