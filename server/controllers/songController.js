const Song = require("../models/Song");

// Higher-Order Wrapper to completely eliminate try/catch boilerplate across routes
const catchAsync = (fn) => (req, res) => {
  fn(req, res).catch((error) => {
    console.error(`🚨 API ERROR [${req.method} ${req.originalUrl}]:`, error.message);
    res.status(500).json({ success: false, message: error.message });
  });
};

// Create Song
exports.createSong = catchAsync(async (req, res) => {
  const { songName, songTitle, singer, albumName, albumTitle, musicDirector, songUrl, image } = req.body;

  const finalName = (songName || songTitle)?.trim();
  const finalAlbum = (albumName || albumTitle)?.trim();

  if (!finalName || !singer?.trim() || !finalAlbum || !musicDirector?.trim() || !songUrl?.trim()) {
    return res.status(400).json({
      success: false,
      message: "All fields (Song Name/Title, Singer, Album, Music Director, Song URL) are strictly required."
    });
  }

  // Saves fallback states systematically across duplicate schema field constraints
  const song = await Song.create({
    songName: finalName,
    songTitle: finalName,
    singer: singer.trim(),
    albumName: finalAlbum,
    albumTitle: finalAlbum,
    musicDirector: musicDirector.trim(),
    songUrl: songUrl.trim(),
    image: image || ""
  });

  res.status(201).json(song);
});

// Update Song
exports.updateSong = catchAsync(async (req, res) => {
  const updateData = { ...req.body };
  
  // Mirror keys dynamically to preserve backward compatibility checks
  if (req.body.songName) updateData.songTitle = req.body.songName;
  if (req.body.albumName) updateData.albumTitle = req.body.albumName;

  const updatedSong = await Song.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { returnDocument: "after", runValidators: true }
  );

  if (!updatedSong) return res.status(404).json({ success: false, message: "Song Not Found" });
  res.json(updatedSong);
});

// User Songs (Visible + Legacy items lacking the field defaults)
exports.getSongs = catchAsync(async (req, res) => {
  const songs = await Song.find({
    $or: [
      { visibility: true },
      { visibility: { $exists: false } }
    ]
  }).sort({ createdAt: -1 });

  res.json(songs);
});

// Admin Songs (Full master logs list overview)
exports.getAllSongs = catchAsync(async (req, res) => {
  const songs = await Song.find().sort({ createdAt: -1 });
  res.json(songs);
});

// Get Single Song
exports.getSongById = catchAsync(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) return res.status(404).json({ message: "Song Not Found" });
  res.json(song);
});

// Delete Song
exports.deleteSong = catchAsync(async (req, res) => {
  const song = await Song.findByIdAndDelete(req.params.id);
  if (!song) return res.status(404).json({ message: "Song Not Found" });
  res.json({ message: "Song Deleted Successfully" });
});

// Toggle Visibility
exports.toggleVisibility = catchAsync(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) return res.status(404).json({ message: "Song Not Found" });

  song.visibility = song.visibility !== false ? false : true;
  await song.save();

  res.json({ message: "Visibility Updated", visibility: song.visibility, song });
});