import { useEffect, useState, useMemo } from "react";
import SidebarSongs from "../components/common/SidebarSongs";
import SearchBar from "../pages/SearchBar";
import MusicPlayer from "../pages/MusicPlayer";
import api from "../services/api";

function Songs() {
  // COMPONENT REACT HOOK STATES
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useState("");

  // FETCH GLOBAL TRACK RECORDINGS
  const loadLibraryData = async () => {
    try {
      const [songsRes, playlistsRes] = await Promise.all([
        api.get("/songs"),
        api.get("/playlists"),
      ]);

      const songsData = Array.isArray(songsRes.data)
        ? songsRes.data
        : songsRes.data.songs || [];

      const playlistsData = Array.isArray(playlistsRes.data)
        ? playlistsRes.data
        : playlistsRes.data.playlists || [];

      // FORMAT INCOMING DATABASE SCHEMAS
      const standardSongs = songsData.map((song) => ({
        _id: song._id,
        trackId: song._id, 
        trackName: song.songName || song.songTitle || "Untitled Track",
        artistName: song.singer || "Unknown Artist",
        collectionName: song.albumName || song.albumTitle || "Unknown Album",
        artworkUrl100: song.image || "https://placehold.co/90",
        previewUrl: song.songUrl || "",
        musicDirector: song.musicDirector || "Unknown Director", 
      }));

      setSongs(standardSongs);
      setPlaylists(playlistsData);
    } catch (error) {
      console.error(error);
      setSongs([]);
      setPlaylists([]);
    }
  };

  // HOOK COMPONENT LIFECYCLE INITIALIZATION
  useEffect(() => {
    loadLibraryData();
  }, []);

  // MULTI ATTRIBUTE FILTER LOGIC
  const filteredSongs = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return songs;

    // EXPAND SEARCH MATCH PARAMETERS
    return songs.filter(
      (song) =>
        song.trackName?.toLowerCase().includes(term) ||
        song.artistName?.toLowerCase().includes(term) ||
        song.collectionName?.toLowerCase().includes(term) ||
        song.musicDirector?.toLowerCase().includes(term)
    );
  }, [search, songs]);

  // SET ACTIVE SELECTION TRACK
  const selectSong = (song) => {
    setCurrentSong(song);
  };

  // QUEUE TIMELINE INDEX SHIFTER
  const shiftTrack = (step) => {
    if (!currentSong) return;

    const currentIndex = filteredSongs.findIndex(
      (song) => song._id === currentSong._id
    );

    const nextIndex = currentIndex + step;

    if (nextIndex >= 0 && nextIndex < filteredSongs.length) {
      setCurrentSong(filteredSongs[nextIndex]);
    }
  };

  // ADD SONG TO PLAYLIST
  const addSongToPlaylist = async () => {
    if (!playlistId) return alert("Select Playlist");
    if (!currentSong?._id) return alert("Select Song");

    try {
      await api.put(`/playlists/${playlistId}/add-song`, {
        songId: currentSong._id,
      });
      alert("Song Added Successfully");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed To Add Song");
    }
  };

  return (
    <div className="container py-3" style={{ color: "#2c3e50" }}>
      <div className="row g-3">
        
        {/* LEFT COLUMN DISCOVERY PANEL */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border">
            <div className="p-2 border-bottom">
              <h6 className="fw-bold m-0">🎵 Music Discovery</h6>
            </div>

            <div style={{ maxHeight: "360px", overflowY: "auto", padding: "4px" }}>
              <SidebarSongs
                songs={filteredSongs}
                currentSong={currentSong}
                playSong={selectSong}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN DETAILS SYSTEM */}
        <div className="col-12 col-md-8 d-flex flex-column gap-3">
          <SearchBar
            search={search}
            setSearch={setSearch}
            suggestions={search.trim() ? filteredSongs.slice(0, 5) : []}
            selectSong={(song) => {
              selectSong(song);
              setSearch(song.trackName);
            }}
            searchSongs={() => {}}
          />

          {/* DYNAMIC CARD VIEW DETAILS */}
          {currentSong ? (
            <div className="card border shadow-sm">
              <div className="card-body">
                <div className="d-flex flex-column flex-sm-row gap-3">
                  <img
                    src={currentSong.artworkUrl100}
                    alt=""
                    style={{ width: "110px", height: "110px", objectFit: "cover", borderRadius: "8px" }}
                  />

                  <div className="flex-grow-1">
                    <h4 className="fw-bold text-dark mb-2">
                      {currentSong.trackName}
                    </h4>

                    <p className="mb-1 text-secondary" style={{ fontSize: "0.95rem" }}>
                      <strong>Singer:</strong> {currentSong.artistName}
                    </p>

                    <p className="mb-1 text-secondary" style={{ fontSize: "0.95rem" }}>
                      <strong>Album Title:</strong> {currentSong.collectionName}
                    </p>

                    <p className="mb-3 text-secondary" style={{ fontSize: "0.95rem" }}>
                      <strong>Music Director:</strong> {currentSong.musicDirector}
                    </p>

                    {/* SELECTION ASSIGNMENT DROPDOWN PANEL */}
                    <div className="d-flex gap-2" style={{ maxWidth: "340px" }}>
                      <select
                        className="form-select form-select-sm"
                        value={playlistId}
                        onChange={(e) => setPlaylistId(e.target.value)}
                      >
                        <option value="">Select Playlist</option>
                        {playlists.map((playlist) => (
                          <option key={playlist._id} value={playlist._id}>
                            {playlist.name}
                          </option>
                        ))}
                      </select>

                      <button className="btn btn-sm btn-success px-3" onClick={addSongToPlaylist}>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-4 text-center text-muted bg-light">
              No Song Selected
            </div>
          )}

          {/* ATTACH MEDIA AUDIO PLAYER */}
          <MusicPlayer
            currentSong={currentSong}
            nextSong={() => shiftTrack(1)}
            previousSong={() => shiftTrack(-1)}
          />
        </div>

      </div>
    </div>
  );
}

export default Songs;