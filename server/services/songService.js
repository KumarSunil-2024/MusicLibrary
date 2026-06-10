const Song = require("../models/Song");
// IMPORT SONG MODEL

class SongService {
  // CREATE NEW SONG
  async createNewSong(bodyData) {
    if (!bodyData) {
      throw new Error("No request payload provided");
    }
    // CHECK REQUEST PAYLOAD

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
    // EXTRACT PAYLOAD FIELDS

    const finalName = (songName || songTitle)?.trim();
    // CLEAN SONG TITLE

    const finalAlbum = (albumName || albumTitle)?.trim();
    // CLEAN ALBUM TITLE

    if (
      !finalName ||
      !singer?.trim() ||
      !finalAlbum ||
      !musicDirector?.trim() ||
      !songUrl?.trim()
    ) {
      throw new Error("All fields required");
    }
    // VALIDATE REQUIRED FIELDS

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
    // SAVE SONG DOCUMENT
  }

  // UPDATE EXISTING SONG
  async updateSongById(id, updateData) {
    if (!id || !updateData) {
      throw new Error("Missing data");
    }
    // CHECK INPUT ENTRIES

    const data = { ...updateData };
    // COPY REQ DATA

    if (data.songName) data.songTitle = data.songName;
    // SYNC SONG TITLE

    if (data.albumName) data.albumTitle = data.albumName;
    // SYNC ALBUM TITLE

    const updated = await Song.findByIdAndUpdate(
      id,
      { $set: data },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
    // UPDATE DATABASE RECORDS

    if (!updated) {
      throw new Error("Song Not Found");
    }
    // VERIFY UPDATE RESULTS

    return updated;
    // RETURN UPDATED SONG
  }

  // FETCH USER SYSTEM CATALOGUE
  async getVisibleSongs() {
    return await Song.find({
      $or: [{ visibility: true }, { visibility: { $exists: false } }],
    }).sort({ createdAt: -1 });
    // FETCH PUBLIC SONGS
  }

  // FETCH MASTER SYSTEM CATALOGUE
  async getAllSongsMaster() {
    return await Song.find().sort({
      createdAt: -1,
    });
    // FETCH ALL SONGS
  }

  // PULL SONG METADATA PROFILE
  async getSongDetails(id) {
    if (!id) {
      throw new Error("Track ID required");
    }
    // CHECK INPUT TARGET

    const song = await Song.findById(id);
    // QUERY DOCUMENT IDENTITY

    if (!song) {
      throw new Error("Song Not Found");
    }
    // EVALUATE TARGET MATCH

    return song;
    // RETURN SONG METADATA
  }

  // DELETE CHOSEN CATALOGUE TRACK
  async removeSongFromDb(id) {
    if (!id) {
      throw new Error("Track ID required");
    }
    // CHECK TARGET TRACK

    const song = await Song.findByIdAndDelete(id);
    // DELETE COLLECTION ITEM

    if (!song) {
      throw new Error("Song Not Found");
    }
    // EVALUATE DELETION TARGET

    return song;
    // RETURN DELETED DOCUMENT
  }

  // TOGGLE WEB VISIBILITY STATUS
  async toggleSongVisibilityState(id) {
    if (!id) {
      throw new Error("Track ID required");
    }
    // CHECK ID EXISTENCE

    const song = await Song.findById(id);
    // FIND TARGET TRACK

    if (!song) {
      throw new Error("Song Not Found");
    }
    // EVALUATE TARGET EXISTS

    song.visibility = song.visibility !== false ? false : true;
    // TOGGLE METADATA BOOLEAN

    await song.save();
    // SAVE MONGOOSE CHANGES

    return song;
  }
}

module.exports = new SongService();
// EXPORT SONG SERVICE
