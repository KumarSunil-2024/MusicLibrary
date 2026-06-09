const playlistService = require("../services/playlistService");
const Song = require("../models/Song"); // Needed for legacy tracking paths

const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error("🚨 CONTROLLER EXECUTION ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  });
};

// 1. Get User Playlists
exports.getPlaylists = asyncHandler(async (req, res) => {
  const playlists = await playlistService.getUserPlaylists(req.user.id);
  res.json(playlists);
});

// 2. Create Playlist
exports.createPlaylist = asyncHandler(async (req, res) => {
  const playlist = await playlistService.createNewPlaylist(req.body.name, req.user.id);
  res.status(201).json(playlist);
});

// 3. Delete Playlist
exports.deletePlaylist = asyncHandler(async (req, res) => {
  await playlistService.removePlaylistById(req.params.id);
  res.json({ message: "Playlist Deleted" });
});

// 4. Add Song to Playlist Collection
exports.addSong = asyncHandler(async (req, res) => {
  const updated = await playlistService.pushSongToCollection(req.params.id, req.body.songId);
  res.json(updated);
});

// 5. Remove Song from Playlist
exports.removeSong = asyncHandler(async (req, res) => {
  const updated = await playlistService.pullSongFromCollection(req.params.id, req.params.songId);
  res.json(updated);
});

// 6. Rename Playlist Title
exports.updatePlaylist = asyncHandler(async (req, res) => {
  const updated = await playlistService.updatePlaylistTitle(req.params.id, req.body.name);
  res.json(updated);
});

// 7. Get All Songs (Satisfies route destructuring fallback)
exports.getAllSongs = asyncHandler(async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});

// 8. Add iTunes Song (Satisfies route destructuring fallback)
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
  res.json({ success: true, playlist: updated });
});