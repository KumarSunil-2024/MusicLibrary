const Song = require("../models/Song");
// Import Song model

class SongService {
  // Song service class

  async createNewSong(bodyData) {
    // Create new song

    if (!bodyData) {
      // Check request data
      throw new Error("No request payload provided");
    }

    const {
      songName,
      songTitle,
      singer,
      albumName,
      albumTitle,
      musicDirector,
      songUrl,
      image,
    } = bodyData;
    // Extract song data

    const finalName = (songName || songTitle)?.trim();
    // Get song name

    const finalAlbum = (albumName || albumTitle)?.trim();
    // Get album name

    if (
      !finalName ||
      !singer?.trim() ||
      !finalAlbum ||
      !musicDirector?.trim() ||
      !songUrl?.trim()
    ) {
      // Validate fields
      throw new Error("All fields required");
    }

    return await Song.create({
      songName: finalName,
      songTitle: finalName,
      singer: singer.trim(),
      albumName: finalAlbum,
      albumTitle: finalAlbum,
      musicDirector: musicDirector.trim(),
      songUrl: songUrl.trim(),
      image: image || "",
    });
    // Save song
  }

  async updateSongById(id, updateData) {
    // Update song

    if (!id || !updateData) {
      // Check inputs
      throw new Error("Missing data");
    }

    const data = { ...updateData };
    // Copy update data

    if (data.songName) data.songTitle = data.songName;
    // Sync song title

    if (data.albumName) data.albumTitle = data.albumName;
    // Sync album title

    const updated = await Song.findByIdAndUpdate(
      id,
      { $set: data },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
    // Update database

    if (!updated) {
      // Song not found
      throw new Error("Song Not Found");
    }

    return updated;
    // Return updated song
  }

  async getVisibleSongs() {
    // Get visible songs

    return await Song.find({
      $or: [{ visibility: true }, { visibility: { $exists: false } }],
    }).sort({ createdAt: -1 });
    // Fetch public songs
  }

  async getAllSongsMaster() {
    // Get all songs

    return await Song.find().sort({
      createdAt: -1,
    });
    // Fetch all songs
  }

  async getSongDetails(id) {
    // Get song details

    if (!id) {
      // Check song ID
      throw new Error("Track ID required");
    }

    const song = await Song.findById(id);
    // Find song

    if (!song) {
      // Song not found
      throw new Error("Song Not Found");
    }

    return song;
    // Return song
  }

  async removeSongFromDb(id) {
    // Delete song

    if (!id) {
      // Check song ID
      throw new Error("Track ID required");
    }

    const song = await Song.findByIdAndDelete(id);
    // Delete song

    if (!song) {
      // Song not found
      throw new Error("Song Not Found");
    }

    return song;
    // Return deleted song
  }

  async toggleSongVisibilityState(id) {
    // Change visibility

    if (!id) {
      // Check song ID
      throw new Error("Track ID required");
    }

    const song = await Song.findById(id);
    // Find song

    if (!song) {
      // Song not found
      throw new Error("Song Not Found");
    }

    song.visibility = song.visibility !== false ? false : true;
    // Toggle visibility

    await song.save();
    // Save changes

    return song;
    // Return updated song
  }
}

module.exports = new SongService();
// Export service
