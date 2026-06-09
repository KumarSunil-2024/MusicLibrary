// Import database models using CommonJS syntax
const Playlist = require("../models/Playlist");
const Song = require("../models/Song");

class PlaylistService {
  // 1. RETRIEVE USER COLLECTIONS: Fetches lists and hydrates nested track objects
  async getUserPlaylists(userId) {
    if (!userId) throw new Error("User identifier required");
    return await Playlist.find({ userId }).populate("songs");
  }

  // 2. CREATE PLAYLIST
  async createNewPlaylist(name, userId) {
    if (!name?.trim() || !userId) {
      throw new Error("Playlist title and user identifier are required");
    }
    return await Playlist.create({ name: name.trim(), userId });
  }

  // 3. REMOVE PLAYLIST
  async removePlaylistById(id) {
    if (!id) throw new Error("Playlist ID required");
    const deleted = await Playlist.findByIdAndDelete(id);
    if (!deleted) throw new Error("Playlist Not Found");
    return deleted;
  }

  // 4. APPEND SONG TO COLLECTION: Standardizes object formats before insertion
  async pushSongToCollection(playlistId, songId) {
    if (!playlistId || !songId) {
      throw new Error("Playlist ID and Song ID are required");
    }

    const song = await Song.findById(songId);
    if (!song) {
      throw new Error("Song not found");
    }

    // Fallback logic for unique song mapping keys
    const trackNum = Number(song.trackId) || Math.floor(100000 + Math.random() * 900000);
    
    const payload = {
      _id: song._id, // Retain original document ID reference
      trackId: trackNum,
      trackName: song.songName || song.songTitle || "Untitled Track",
      artistName: song.singer || "Unknown Artist",
      albumName: song.albumName || s.albumTitle || "Single",
      artworkUrl: song.image || "/default-music.png",
      previewUrl: song.songUrl,
      releaseDate: song.createdAt ? song.createdAt.toISOString() : new Date().toISOString(),
      genre: song.genre || "General",
    };

    const updated = await Playlist.findByIdAndUpdate(
      playlistId,
      { $push: { songs: payload } },
      { returnDocument: "after", runValidators: true }
    );

    if (!updated) {
      throw new Error("Playlist Not Found");
    }
    return updated;
  }

  // 5. DETACH SONG FROM COLLECTION: Safely drops subdocument matches
  async pullSongFromCollection(playlistId, songId) {
    if (!playlistId || !songId) {
      throw new Error("Playlist ID and Song ID are required");
    }

    // Cleaned up the query block to ensure stable array matching
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

    if (!updated) {
      throw new Error("Playlist Not Found");
    }
    return updated;
  }

  // 6. RENAME PLAYLIST
  async updatePlaylistTitle(id, newName) {
    if (!id || !newName?.trim()) {
      throw new Error("Playlist ID and new title name are required");
    }

    const updated = await Playlist.findByIdAndUpdate(
      id,
      { name: newName.trim() },
      { returnDocument: "after", runValidators: true }
    );

    if (!updated) {
      throw new Error("Playlist Not Found");
    }
    return updated;
  }
}

// Export a single initialized instance of the service class
module.exports = new PlaylistService();