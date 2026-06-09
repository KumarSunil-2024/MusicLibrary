// 🎯 FIX: Changed from 'import' to 'require'
const Playlist = require("../models/Playlist");
const Song = require("../models/Song");

class PlaylistService {
  // Fetches lists and populates subdocument properties for frontend tracking
  async getUserPlaylists(userId) {
    return await Playlist.find({ userId }).populate("songs");
  }

  async createNewPlaylist(name, userId) {
    return await Playlist.create({ name: name.trim(), userId });
  }

  async removePlaylistById(id) {
    const deleted = await Playlist.findByIdAndDelete(id);
    if (!deleted) throw new Error("Playlist Not Found");
    return deleted;
  }

  async pushSongToCollection(playlistId, songId) {
    const song = await Song.findById(songId);
    if (!song) throw new Error("Song not found");

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
      playlistId,
      { $push: { songs: payload } },
      { returnDocument: "after", runValidators: true }
    );
    if (!updated) throw new Error("Playlist Not Found");
    return updated;
  }

  async pullSongFromCollection(playlistId, songId) {
    const updated = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $pull: {
          songs: {
            $or: [
              { _id: songId },
              { trackId: Number(songId) || 0 }
            ]
          }
        }
      },
      { returnDocument: "after" }
    );
    if (!updated) throw new Error("Playlist Not Found");
    return updated;
  }

  async updatePlaylistTitle(id, newName) {
    const updated = await Playlist.findByIdAndUpdate(
      id,
      { name: newName.trim() },
      { returnDocument: "after", runValidators: true }
    );
    if (!updated) throw new Error("Playlist Not Found");
    return updated;
  }
}

// 🎯 FIX: Changed from 'export default' to CommonJS module exports
module.exports = new PlaylistService();