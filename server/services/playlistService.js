const Playlist = require("../models/Playlist");
const Song = require("../models/Song");

class PlaylistService {
  // GET ALL USER PLAYLISTS
  async getUserPlaylists(userId) {
    if (!userId) throw new Error("User identifier required");
    return Playlist.find({ userId });
  }

  // CREATE NEW EMPTY PLAYLIST
  async createNewPlaylist(name, userId) {
    if (!name?.trim() || !userId) {
      throw new Error("Playlist title and user identifier are required");
    }
    return Playlist.create({ name: name.trim(), userId });
  }

  // REMOVE ENTIRE PLAYLIST INSTANCE
  async removePlaylistById(id) {
    if (!id) throw new Error("Playlist ID required");

    const playlist = await Playlist.findByIdAndDelete(id);
    if (!playlist) throw new Error("Playlist Not Found");

    return playlist;
  }

  // PUSH INTERNAL SONG DOCUMENT
  async pushSongToCollection(playlistId, songId) {
    if (!playlistId || !songId) {
      throw new Error("Playlist ID and Song ID are required");
    }

    const song = await Song.findById(songId);
    if (!song) throw new Error("Song not found");

    // STRUCTURE UNIFORM METADATA MAP
    const payload = {
      trackId: Date.now(), 
      trackName: song.songName || song.songTitle || "Unknown Track",
      artistName: song.singer || "Unknown Artist",
      albumName: song.albumName || song.albumTitle || "Unknown Album",
      artworkUrl: song.image || "",
      previewUrl: song.songUrl || "",
      releaseDate: new Date().toISOString(),
      genre: "",
    };

    const updated = await Playlist.findByIdAndUpdate(
      playlistId,
      { $push: { songs: payload } },
      { new: true, runValidators: true }
    );

    if (!updated) throw new Error("Playlist not found");
    return updated;
  }

  // PUSH EXTERNAL ITUNES SONG
  async pushItunesSongToCollection(playlistId, songData) {
    if (!playlistId || !songData) {
      throw new Error("Playlist ID and song data are required");
    }

    // MAP INCOMING ITUNES PROPERTIES
    const payload = {
      trackId: Number(songData.trackId) || Date.now(),
      trackName: songData.trackName || "Unknown Track",
      artistName: songData.artistName || "Unknown Artist",
      albumName: songData.albumName || "Unknown Album",
      artworkUrl: songData.artworkUrl || "",
      previewUrl: songData.previewUrl || "",
      releaseDate: songData.releaseDate || new Date().toISOString(),
      genre: songData.genre || "",
    };

    const updated = await Playlist.findByIdAndUpdate(
      playlistId,
      { $push: { songs: payload } },
      { new: true, runValidators: true }
    );

    if (!updated) throw new Error("Playlist not found");
    return updated;
  }

  // REMOVE SONG FROM SUBCOLLECTION
  async pullSongFromCollection(playlistId, targetId) {
    if (!playlistId || !targetId) {
      throw new Error("Playlist ID and Track target identification are required");
    }

    const numericId = Number(targetId);
    const finalizedTrackId = isNaN(numericId) ? targetId : numericId;

    // FIX: PROPER MONGODB SUBDOCUMENT CONDITIONAL PULL
    const updated = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $pull: {
          songs: {
            $or: [
              { _id: targetId },
              { trackId: finalizedTrackId }
            ]
          }
        }
      },
      { new: true }
    );

    if (!updated) throw new Error("Playlist not found");
    return updated;
  }

  // UPDATE PLAYLIST METADATA TITLE
  async updatePlaylistTitle(id, newName) {
    if (!id || !newName?.trim()) {
      throw new Error("Playlist ID and title required");
    }

    const updated = await Playlist.findByIdAndUpdate(
      id,
      { name: newName.trim() },
      { new: true }
    );

    if (!updated) throw new Error("Playlist not found");
    return updated;
  }
}

module.exports = new PlaylistService();