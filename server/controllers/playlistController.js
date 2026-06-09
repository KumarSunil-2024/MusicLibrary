const Playlist = require("../models/Playlist");
const Song = require("../models/Song");

// Higher-Order Wrapper to safely catch async errors globally and eliminate try/catch blocks
const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error(`🚨 PLAYLIST ERROR [${req.method} ${req.originalUrl}]:`, err.message);
    res.status(500).json({ success: false, message: err.message });
  });
};

// 1. Create Playlist
exports.createPlaylist = asyncHandler(async (req, res) => {
  if (!req.body.name?.trim()) {
    return res.status(400).json({ success: false, message: "Playlist name is required" });
  }

  const playlist = await Playlist.create({
    name: req.body.name.trim(),
    userId: req.user.id,
  });
  res.status(201).json(playlist);
});

// 2. Get User Playlists
exports.getPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ userId: req.user.id });
  res.json(playlists);
});

// 3. Delete Playlist
exports.deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findByIdAndDelete(req.params.id);
  if (!playlist) return res.status(404).json({ success: false, message: "Playlist Not Found" });
  res.json({ message: "Playlist Deleted" });
});

// 4. Add Song To Playlist
exports.addSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.body.songId);
  if (!song) return res.status(404).json({ message: "Song not found" });

  const trackNum = Number(song.trackId) || Math.floor(100000 + Math.random() * 900000);

  const payload = {
    trackId: trackNum,
    trackName: song.songName || song.songTitle || "Untitled Track",
    artistName: song.singer || "Unknown Artist",
    albumName: song.albumName || song.albumTitle || "Single",
    artworkUrl: song.image || song.artworkUrl100 || "/default-music.png",
    previewUrl: song.songUrl,
    releaseDate: song.createdAt ? song.createdAt.toISOString() : new Date().toISOString(),
    genre: song.genre || "General",
  };

  const updated = await Playlist.findByIdAndUpdate(
    req.params.id,
    { $push: { songs: payload } },
    { returnDocument: "after", runValidators: true },
  );

  if (!updated) return res.status(404).json({ success: false, message: "Playlist Not Found" });
  res.json(updated);
});

// 5. Remove Song
exports.removeSong = asyncHandler(async (req, res) => {
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
    { returnDocument: "after" },
  );
  
  if (!updated) return res.status(404).json({ success: false, message: "Playlist Not Found" });
  res.json(updated);
});

// 6. Rename Playlist
exports.updatePlaylist = asyncHandler(async (req, res) => {
  const updated = await Playlist.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name?.trim() },
    { returnDocument: "after", runValidators: true },
  );
  
  if (!updated) return res.status(404).json({ success: false, message: "Playlist Not Found" });
  res.json(updated);
});

// 7. Get All Songs
exports.getAllSongs = asyncHandler(async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});

// 8. Add iTunes Song
exports.addItunesSong = asyncHandler(async (req, res) => {
  const trackArtwork = req.body.image || req.body.artworkUrl100 || req.body.artworkUrl || "/default-music.png";
  const nameString = req.body.songName || req.body.songTitle || req.body.trackName || "Untitled Track";
  const albumString = req.body.albumName || req.body.albumTitle || req.body.collectionName || "Single";

  const updated = await Playlist.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        songs: {
          ...req.body,
          trackName: nameString,
          albumName: albumString,
          artworkUrl: trackArtwork,
          trackId: Number(req.body.trackId) || 0,
          releaseDate: String(req.body.releaseDate || ""),
        },
      },
    },
    { returnDocument: "after" },
  );
  
  if (!updated) return res.status(404).json({ success: false, message: "Playlist Not Found" });
  res.json({ success: true, playlist: updated });
});