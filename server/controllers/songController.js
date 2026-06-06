const Song = require("../models/Song");

// Create Song

exports.createSong = async (req, res) => {
  try {
    const song = await Song.create(req.body);

    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// User Songs (Visible Only)

exports.getSongs = async (req, res) => {
  try {
    const songs = await Song.find({
      visibility: true,
    });

    res.json(songs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin Songs (All)

exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();

    res.json(songs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Song

exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        message: "Song Not Found",
      });
    }

    res.json(song);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Song

exports.updateSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(song);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Song

exports.deleteSong = async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);

    res.json({
      message: "Song Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Toggle Visibility

exports.toggleVisibility = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        message: "Song Not Found",
      });
    }

    song.visibility = !song.visibility;

    await song.save();

    res.json({
      message: "Visibility Updated",
      visibility: song.visibility,
      song,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
