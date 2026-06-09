const Song = require("../models/Song");

class SongService {
  // Create a new song with safe defaults and dual-schema compatibility keys
  async createNewSong(bodyData) {
    const { songName, songTitle, singer, albumName, albumTitle, musicDirector, songUrl, image } = bodyData;

    const finalName = (songName || songTitle)?.trim();
    const finalAlbum = (albumName || albumTitle)?.trim();

    if (!finalName || !singer?.trim() || !finalAlbum || !musicDirector?.trim() || !songUrl?.trim()) {
      throw new Error("All fields (Song Name, Singer, Album, Music Director, Song URL) are required.");
    }

    return await Song.create({
      songName: finalName,
      songTitle: finalName,
      singer: singer.trim(),
      albumName: finalAlbum,
      albumTitle: finalAlbum,
      musicDirector: musicDirector.trim(),
      songUrl: songUrl.trim(),
      image: image || ""
    });
  }

  // Update song data while mirroring keys to preserve system compatibility
  async updateSongById(id, updateData) {
    const data = { ...updateData };
    if (data.songName) data.songTitle = data.songName;
    if (data.albumName) data.albumTitle = data.albumName;

    const updated = await Song.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: "after", runValidators: true }
    );
    if (!updated) throw new Error("Song Not Found");
    return updated;
  }

  // Fetch only visible songs (Admin Story 3 tracking)
  async getVisibleSongs() {
    return await Song.find({
      $or: [
        { visibility: true },
        { visibility: { $exists: false } }
      ]
    }).sort({ createdAt: -1 });
  }

  // Fetch all songs (Admin-only master view)
  async getAllSongsMaster() {
    return await Song.find().sort({ createdAt: -1 });
  }

  async getSongDetails(id) {
    const song = await Song.findById(id);
    if (!song) throw new Error("Song Not Found");
    return song;
  }

  async removeSongFromDb(id) {
    const song = await Song.findByIdAndDelete(id);
    if (!song) throw new Error("Song Not Found");
    return song;
  }

  // Toggle true/false track accessibility status on the fly
  async toggleSongVisibilityState(id) {
    const song = await Song.findById(id);
    if (!song) throw new Error("Song Not Found");

    song.visibility = song.visibility !== false ? false : true;
    await song.save();
    return song;
  }
}

module.exports = new SongService();