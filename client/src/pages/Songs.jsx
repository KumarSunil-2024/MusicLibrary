import { useEffect, useState, useMemo } from "react";
import SidebarSongs from "../components/common/SidebarSongs";
import SearchBar from "../pages/SearchBar";
import MusicPlayer from "../pages/MusicPlayer";
import api from "../services/api";

function Songs() {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useState("");

  // 1. CLEAN EXPLICIT CONCURRENT INITIALIZATION FETCH
  const loadLibraryData = async () => {
    try {
      const [songsRes, playlistsRes] = await Promise.all([
        api.get("/songs"),
        api.get("/playlists")
      ]);
      
      const standardSongs = (songsRes.data || []).map(s => ({
        trackId: s._id,
        trackName: s.songName || s.songTitle || "Unknown Track",
        artistName: s.singer || "Unknown Artist",
        collectionName: s.albumName || s.albumTitle || "Unknown Album",
        artworkUrl100: s.image || "https://placehold.co/90",
        previewUrl: s.songUrl,
        musicDirector: s.musicDirector
      }));

      setSongs(standardSongs);
      setPlaylists(playlistsRes.data || []);
    } catch (err) { 
      console.error("Library boot failure:", err); 
    }
  };

  useEffect(() => {
    loadLibraryData();
  }, []);

  // 2. CLEAR FILTER QUERY TRACKING
  const filteredSongs = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return songs;
    return songs.filter(s => 
      s.trackName?.toLowerCase().includes(term) || 
      s.artistName?.toLowerCase().includes(term)
    );
  }, [search, songs]);

  const selectSong = (song) => {
    setCurrentSong(song);
  };

  // 3. EXPLICIT QUEUE SKIP HANDLER
  const shiftTrack = (step) => {
    if (!currentSong || filteredSongs.length === 0) return;
    
    const currentFilteredIdx = filteredSongs.findIndex(s => s.trackId === currentSong.trackId);
    const nextIdx = currentFilteredIdx + step;

    if (nextIdx >= 0 && nextIdx < filteredSongs.length) {
      setCurrentSong(filteredSongs[nextIdx]);
    }
  };

  const addSongToPlaylist = async () => {
    if (!playlistId) return alert("Select a target playlist destination!");
    try {
      await api.put(`/playlists/${playlistId}/add-song`, { songId: currentSong.trackId });
      alert("Song Added To Playlist Successfully!");
    } catch (err) {
      console.error("Failed to add song to playlist:", err);
    }
  };

  return (
    <div className="container py-3" style={{ color: "#2c3e50" }}>
      <div className="row g-3">
        
        {/* LEFT COLUMN: SIDEBAR LIST (Folds to full width on phone) */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm border" style={{ backgroundColor: "#f8fafc", borderRadius: "10px" }}>
            <div className="p-2 border-bottom" style={{ backgroundColor: "#edf2f7" }}>
              <h6 className="fw-bold m-0" style={{ color: "#1e3a8a" }}>🎵 Music Discovery</h6>
            </div>
            <div style={{ maxHeight: "360px", overflowY: "auto", padding: "4px" }}>
              <SidebarSongs songs={filteredSongs} currentSong={currentSong} playSong={selectSong} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTROLS & SELECTED DISPLAY */}
        <div className="col-12 col-md-8 d-flex flex-column gap-3">
          
          <SearchBar 
            search={search} 
            setSearch={setSearch} 
            suggestions={search.trim() ? filteredSongs.slice(0, 5) : []} 
            selectSong={(s) => { selectSong(s); setSearch(s.trackName); }} 
            searchSongs={() => {}} 
          />

          {currentSong ? (
            <div className="card border shadow-sm" style={{ borderRadius: "10px", overflow: "hidden" }}>
              <div className="card-body p-3 bg-white">
                
                {/* Responsive details wrap: turns to row on laptop, stacks on mobile */}
                <div className="d-flex flex-column flex-sm-row align-items-center gap-3">
                  
                  <img 
                    src={currentSong.artworkUrl100} 
                    alt="" 
                    style={{ width: "90px", height: "90px", borderRadius: "8px", objectFit: "cover" }} 
                  />
                  
                  <div className="flex-grow-1 text-center text-sm-start w-100">
                    <h5 className="fw-bold mb-1 text-dark">
                      {currentSong.trackName}{" "}
                      <span className="badge bg-light text-primary border ms-1" style={{ fontSize: "0.7rem" }}>Library</span>
                    </h5>
                    
                    <p className="m-0 text-muted mb-2" style={{ fontSize: "0.85rem" }}>
                      <strong>Artist:</strong> {currentSong.artistName} &nbsp;|&nbsp; <strong>Album:</strong> {currentSong.collectionName}
                    </p>

                    {/* Playlist Integration controls */}
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-sm-start gap-2 pt-2 border-top">
                      <select 
                        className="form-select form-select-sm w-auto" 
                        style={{ fontSize: "0.8rem", minWidth: "180px" }} 
                        value={playlistId} 
                        onChange={e => setPlaylistId(e.target.value)}
                      >
                        <option value="">➕ Select Playlist Target</option>
                        {playlists.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                      </select>
                      <button className="btn btn-sm btn-success fw-bold px-3" onClick={addSongToPlaylist}>Add</button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          ) : (
            <div className="card text-center border p-4 shadow-sm bg-white" style={{ borderRadius: "10px" }}>
              <span>✨</span>
              <h6 className="fw-bold mt-2 text-dark m-0">No Song Selected</h6>
              <small className="text-muted">Choose a track from the sidebar listing to initialize audio streaming parameters.</small>
            </div>
          )}

          {/* Audio Engine Player Element Attachment */}
          <MusicPlayer currentSong={currentSong} nextSong={() => shiftTrack(1)} previousSong={() => shiftTrack(-1)} />
        </div>

      </div>
    </div>
  );
}

export default Songs;