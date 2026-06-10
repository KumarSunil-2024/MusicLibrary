const Playlist = require("../models/Playlist");
// Import Playlist model

const Song = require("../models/Song");
// Import Song model

class PlaylistService {
  // Playlist service class

  async getUserPlaylists(userId) {
    // Get user playlists

    if (!userId) {
      // Check user ID
      throw new Error("User identifier required");
    }

    return await Playlist.find({ userId }).populate("songs");
    // Fetch playlists
  }

  async createNewPlaylist(name, userId) {
    // Create playlist

    if (!name?.trim() || !userId) {
      // Validate inputs
      throw new Error("Playlist title and user identifier are required");
    }

    return await Playlist.create({
      name: name.trim(),
      userId,
    });
    // Save playlist
  }

  async removePlaylistById(id) {
    // Delete playlist

    if (!id) {
      // Check playlist ID
      throw new Error("Playlist ID required");
    }

    const deleted = await Playlist.findByIdAndDelete(id);
    // Delete from database

    if (!deleted) {
      // Playlist not found
      throw new Error("Playlist Not Found");
    }

    return deleted;
    // Return deleted playlist
  }

  async pushSongToCollection(playlistId, songId) {
    // Add song to playlist

    if (!playlistId || !songId) {
      // Validate IDs
      throw new Error("Playlist ID and Song ID are required");
    }

    const song = await Song.findById(songId);
    // Find song

    if (!song) {
      // Song not found
      throw new Error("Song not found");
    }

    const payload = {
      // Create song object
      _id: song._id,
      trackId: Number(song.trackId),
      trackName: song.songName,
      artistName: song.singer,
      albumName: song.albumName,
      artworkUrl: song.image,
      previewUrl: song.songUrl,
    };

    const updated = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $push: {
          songs: payload,
        },
      },
      {
        returnDocument: "after",
      }
    );
    // Add song

    return updated;
    // Return updated playlist
  }

  async pullSongFromCollection(playlistId, songId) {
    // Remove song

    if (!playlistId || !songId) {
      // Validate IDs
      throw new Error("Playlist ID and Song ID are required");
    }

    const updated = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $pull: {
          songs: {
            _id: songId,
          },
        },
      },
      {
        returnDocument: "after",
      }
    );
    // Remove song

    return updated;
    // Return playlist
  }

  async updatePlaylistTitle(id, newName) {
    // Rename playlist

    if (!id || !newName?.trim()) {
      // Validate data
      throw new Error("Playlist ID and title required");
    }

    const updated = await Playlist.findByIdAndUpdate(
      id,
      {
        name: newName.trim(),
      },
      {
        returnDocument: "after",
      }
    );
    // Update playlist name

    return updated;
    // Return updated playlist
  }
}

module.exports = new PlaylistService();
// Export service instance