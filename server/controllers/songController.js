const Song = require("../models/Song");

// Create Song
exports.createSong = async (req, res) => {
  try {
    const { songName, singer, albumName, musicDirector, songUrl, image } = req.body;

    // Validate required text descriptors strictly
    if (!songName?.trim() || !singer?.trim() || !albumName?.trim() || !musicDirector?.trim() || !songUrl?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields (Song Name, Singer, Album, Music Director, Song URL) are strictly required."
      });
    }

    // Save directly with the passed JSON image URL string
    const song = await Song.create({
      songName,
      singer,
      albumName,
      musicDirector,
      songUrl,
      image: image || ""
    });

    res.status(201).json(song);
  } catch (error) {
    console.error("🚨 MONGOOSE CREATION ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Song
exports.updateSong = async (req, res) => {
  try {
    console.log("===============");
    console.log("MUTATION ID:", req.params.id);
    console.log("PAYLOAD BODY:", req.body);
    console.log("===============");

    // 🛠️ BUG FIX: Performs the actual database patch and returns the fresh document data safely
    const updatedSong = await Song.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: "after", runValidators: true } // Cleans up the old deprecation warning log!
    );

    if (!updatedSong) {
      return res.status(404).json({ success: false, message: "Song Not Found" });
    }

    res.json(updatedSong);
  } catch (error) {
    console.error("🚨 MONGOOSE UPDATE ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// User Songs (Visible Only)
exports.getSongs = async (req, res) => {
  try {
    const songs = await Song.find({ visibility: true }).sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Songs (All)
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Song
exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song Not Found" });
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Song
exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: "Song Not Found" });
    res.json({ message: "Song Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Visibility
exports.toggleVisibility = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song Not Found" });

    song.visibility = !song.visibility;
    await song.save();

    res.json({ message: "Visibility Updated", visibility: song.visibility, song });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};