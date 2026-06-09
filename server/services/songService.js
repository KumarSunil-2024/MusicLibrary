const Song = require("../models/Song");

class SongService {
  // 1. CREATE TRACK: Normalizes dual keys and persists new records
  async createNewSong(bodyData) {
    if (!bodyData) {
      throw new Error("No request payload provided");
    }

    const { songName, songTitle, singer, albumName, albumTitle, musicDirector, songUrl, image } = bodyData;

    // Bridge field name mismatches gracefully
    const finalName = (songName || songTitle)?.trim();
    const finalAlbum = (albumName || albumTitle)?.trim();

    if (!finalName || !singer?.trim() || !finalAlbum || !musicDirector?.trim() || !songUrl?.trim()) {
      throw new Error("All fields (Song Name, Singer, Album, Music Director, Song URL) are required.");
    }

    return await Song.create({
      songName: finalName,
      songTitle: finalName, // Maintained for frontend compatibility
      singer: singer.trim(),
      albumName: finalAlbum,
      albumTitle: finalAlbum, // Maintained for frontend compatibility
      musicDirector: musicDirector.trim(),
      songUrl: songUrl.trim(),
      image: image || "",
    });
  }

  // 2. UPDATE TRACK: Overrides record modifications with validator gates
  async updateSongById(id, updateData) {
    if (!id || !updateData) {
      throw new Error("Missing record identifier or payload updates");
    }

    const data = { ...updateData };
    
    // Mirror structural adjustments across compatibility parameters
    if (data.songName) data.songTitle = data.songName;
    if (data.albumName) data.albumTitle = data.albumName;

    const updated = await Song.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: "after", runValidators: true }
    );
    
    if (!updated) {
      throw new Error("Song Not Found");
    }
    
    return updated;
  }

  // 3. RETRIEVE CLIENT INDEX: Fetches active public records for users
  async getVisibleSongs() {
    return await Song.find({
      $or: [
        { visibility: true },
        { visibility: { $exists: false } } // Catches records created before visibility rules existed
      ]
    }).sort({ createdAt: -1 });
  }

  // 4. RETRIEVE ADMINISTRATIVE MASTER INDEX: Fetches all files
  async getAllSongsMaster() {
    return await Song.find().sort({ createdAt: -1 });
  }

  // 5. VIEW TRACK METADATA
  async getSongDetails(id) {
    if (!id) throw new Error("Track ID required");
    const song = await Song.findById(id);
    if (!song) throw new Error("Song Not Found");
    return song;
  }

  // 6. DETACH TRACK
  async removeSongFromDb(id) {
    if (!id) throw new Error("Track ID required");
    const song = await Song.findByIdAndDelete(id);
    if (!song) throw new Error("Song Not Found");
    return song;
  }

  // 7. TOGGLE SYSTEM VISIBILITY: Swaps track accessibility states instantly
  async toggleSongVisibilityState(id) {
    if (!id) throw new Error("Track ID required");
    const song = await Song.findById(id);
    if (!song) throw new Error("Song Not Found");

    // Explicit boolean structural inversion
    song.visibility = song.visibility !== false ? false : true;
    await song.save();
    return song;
  }
}

// Export a single initialized instance of the service class
module.exports = new SongService();