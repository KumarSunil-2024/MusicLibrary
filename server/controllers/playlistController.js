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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Playlists
exports.getPlaylists = async (req, res) => {
  try {
    // FIXED: Removed .populate("songs") since songs are embedded subdocuments, not collection pointers
    const playlists = await Playlist.find({ userId: req.user.id });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Playlist
exports.deletePlaylist = async (req, res) => {
  try {
    await Playlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Playlist Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Song To Playlist
exports.addSong = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    playlist.songs.push(req.body.songId);
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove Song (FIXED LAYER)
exports.removeSong = async (req, res) => {
  try {
    const { id, songId } = req.params;

    // Directly uses Mongoose atomic array updates via $pull
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      id,
      {
        $pull: {
          songs: {
            $or: [
              { _id: songId }, // Match against mongoose subdocument system ID
              { trackId: Number(songId) || 0 } // Safe fallback matching iTunes API ID format
            ]
          }
        }
      },
      { new: true }
    );

    if (!updatedPlaylist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rename Playlist
exports.updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Songs
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add iTunes Song
exports.addItunesSong = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    playlist.songs.push({
      trackId: req.body.trackId,
      trackName: req.body.trackName,
      artistName: req.body.artistName,
      albumName: req.body.albumName,
      artworkUrl: req.body.artworkUrl,
      previewUrl: req.body.previewUrl,
      releaseDate: req.body.releaseDate,
      genre: req.body.genre,
    });

    await playlist.save();
    res.json({
      success: true,
      message: "Song Added",
      playlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};