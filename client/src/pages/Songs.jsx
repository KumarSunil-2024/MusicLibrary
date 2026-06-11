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
    <div className="container py-3" style={{ color: "#1e293b", fontFamily: "sans-serif" }}>
      
      {/* MINIMAL COMPACT HERO BANNER */}
      <div
        className="p-3 mb-3 shadow-sm d-flex justify-content-between align-items-center"
        style={{ 
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", 
          borderRadius: "12px",
          color: "#ffffff"
        }}
      >
        <div>
          <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
            <span>🎵</span> Audio Library
          </h5>
        </div>
        <div>
          <span className="badge bg-light text-dark fw-bold px-2 py-1" style={{ borderRadius: "6px", fontSize: "0.75rem" }}>
            {filteredSongs.length} Tracks
          </span>
        </div>
      </div>

      <div className="row g-3">
        
        {/* LEFT COLUMN COMPACT PANEL */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm bg-white" style={{ borderRadius: "12px", overflow: "hidden" }}>
            <div className="px-3 py-2 border-bottom bg-light">
              <h6 className="fw-bold m-0 small text-dark">🎧 Explorer</h6>
            </div>

            <div style={{ maxHeight: "380px", overflowY: "auto", padding: "4px" }}>
              <SidebarSongs
                songs={filteredSongs}
                currentSong={currentSong}
                playSong={selectSong}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN DETAILS SYSTEM */}
        <div className="col-12 col-lg-8 d-flex flex-column gap-2">
          
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

          {/* DYNAMIC METADATA CARD VIEW */}
          {currentSong ? (
            <div className="card border-0 shadow-sm bg-white" style={{ borderRadius: "12px", overflow: "hidden" }}>
              <div className="card-body p-3">
                <div className="d-flex gap-3 align-items-center">
                  
                  <img
                    src={currentSong.artworkUrl100}
                    alt=""
                    className="shadow-sm transition-all style-art"
                    style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "10px" }}
                  />

                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <h5 className="fw-bold text-dark mb-1 text-truncate">{currentSong.trackName}</h5>
                    
                    {/* INLINE COMPACT DETAILS ROW */}
                    <p className="text-muted mb-2 text-truncate" style={{ fontSize: "0.8rem" }}>
                      🎤 {currentSong.artistName} • 💿 {currentSong.collectionName} • 🎼 {currentSong.musicDirector}
                    </p>

                    {/* COMPACT PLAYLIST INTERFACE */}
                    <div className="d-flex gap-2" style={{ maxWidth: "280px" }}>
                      <select
                        className="form-select form-select-sm border shadow-sm style-select"
                        style={{ borderRadius: "6px", fontSize: "0.8rem" }}
                        value={playlistId}
                        onChange={(e) => setPlaylistId(e.target.value)}
                      >
                        <option value="">Add to Playlist</option>
                        {playlists.map((playlist) => (
                          <option key={playlist._id} value={playlist._id}>
                            {playlist.name}
                          </option>
                        ))}
                      </select>

                      <button className="btn btn-sm btn-success fw-bold px-3 shadow-sm" style={{ borderRadius: "6px", fontSize: "0.8rem" }} onClick={addSongToPlaylist}>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="card p-4 text-center text-muted d-flex align-items-center justify-content-center border-2 border-dashed bg-light"
              style={{ borderRadius: "12px", minHeight: "122px", fontSize: "0.85rem" }}
            >
              Select a track from the sidebar to display playback details.
            </div>
          )}

          <MusicPlayer
            currentSong={currentSong}
            nextSong={() => shiftTrack(1)}
            previousSong={() => shiftTrack(-1)}
          />
        </div>

      </div>

      <style>{`
        .transition-all { transition: all 0.2s ease-in-out; }
        .style-art:hover { transform: scale(1.04); }
        .style-select:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 0.15rem rgba(99, 102, 241, 0.25) !important; }
      `}</style>
    </div>
  );
}

export default Songs;