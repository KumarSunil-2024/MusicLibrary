const Song = require("../models/Song");



// Create Song
exports.createSong = async (req, res) => {
  try {
    // 1. Pull the fields parsed out by Multer
    const { songName, singer, albumName, musicDirector, songUrl } = req.body;

    // 2. Validate that none of the required strings arrived blank
    if (!songName || !singer || !albumName || !musicDirector || !songUrl) {
      return res.status(400).json({
        success: false,
        message: "All fields (Song Name, Singer, Album, Music Director, Song URL) are strictly required."
      });
    }

    // 3. Assemble a clean dataset matching your Schema fields exactly
    const songData = {
      songName,
      singer,
      albumName,
      musicDirector,
      songUrl,
      artworkUrl100: "" // Default empty if no file is provided
    };

    // 4. Check if an image file was uploaded
    if (req.file) {
      songData.artworkUrl100 = `/uploads/${req.file.filename}`;
    }

    // 5. Save cleanly to MongoDB
    const song = await Song.create(songData);

    res.status(201).json(song);
  } catch (error) {
    // This logs the exact error details into your Node/Express terminal window
    console.error("🚨 MONGOOSE CREATION ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Song
exports.updateSong = async (req, res) => {
  try {
    console.log("===============");
    console.log("ID:", req.params.id);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("===============");

    return res.json({
      success: true,
      body: req.body,
      file: req.file,
    });
  } catch (error) {
    console.log(error);

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
