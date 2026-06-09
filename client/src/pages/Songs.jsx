import { useEffect, useState, useMemo, useCallback } from "react";
import SidebarSongs from "../components/SidebarSongs";
import SearchBar from "../components/SearchBar";
import MusicPlayer from "../pages/MusicPlayer";
import api from "../services/api";

function Songs() {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useState("");

  // Fetches core collections concurrently on view initialization
  useEffect(() => {
    (async () => {
      try {
        const [songsRes, playlistsRes] = await Promise.all([
          api.get("/songs"),
          api.get("/playlists")
        ]);
        
        setSongs(songsRes.data.map(s => ({
          trackId: s._id,
          
          // 🛠️ ROOT CAUSE SOLUTION: Fallbacks bridge 'songName' and 'songTitle' mismatch seamlessly
          trackName: s.songName || s.songTitle || "Unknown Track",
          artistName: s.singer || "Unknown Artist",
          collectionName: s.albumName || s.albumTitle || "Unknown Album",
          
          // Dynamic text string checking maps artwork images reliably 
          artworkUrl100: s.image || "/default-music.png",
          
          previewUrl: s.songUrl,
          musicDirector: s.musicDirector
        })));
        setPlaylists(playlistsRes.data);
      } catch (err) { console.error("Library boot failure:", err); }
    })();
  }, []);

  // Performance Memoization tracks filtering parameters cleanly in application memory
  const filteredSongs = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return songs;
    return songs.filter(s => 
      s.trackName?.toLowerCase().includes(term) || 
      s.artistName?.toLowerCase().includes(term)
    );
  }, [search, songs]);

  // Performance Optimization: Cache element trigger handlers to prevent parent loop redraws
  const selectSong = useCallback((song) => {
    setCurrentSong(song);
  }, []);

  // Fixed Context Index Shuffling: Keeps player queue boundaries mapped to your sidebar filtering state
  const shiftTrack = useCallback((step) => {
    if (!currentSong || !filteredSongs.length) return;
    
    const currentFilteredIdx = filteredSongs.findIndex(s => s.trackId === currentSong.trackId);
    const nextIdx = currentFilteredIdx + step;

    if (nextIdx >= 0 && nextIdx < filteredSongs.length) {
      setCurrentSong(filteredSongs[nextIdx]);
    }
  }, [currentSong, filteredSongs]);

  return (
    <div className="container py-3" style={{ color: "#2c3e50" }}>
      <div className="row g-3">
        
        {/* Left Side: Dynamic Sidebar Music Discovery Grid */}
        <div className="col-md-4">
          <div className="card shadow-sm border" style={{ backgroundColor: "#f8fafc", borderRadius: "10px" }}>
            <div className="p-2 border-bottom" style={{ backgroundColor: "#edf2f7" }}>
              <h6 className="fw-bold m-0" style={{ color: "#1e3a8a" }}>🎵 Music Discovery</h6>
            </div>
            <div style={{ height: "360px", overflowY: "auto", padding: "4px" }}>
              <SidebarSongs songs={filteredSongs} currentSong={currentSong} playSong={selectSong} />
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Search Hub & Focused Control Deck */}
        <div className="col-md-8 d-flex flex-column gap-3">
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
                <div className="d-flex flex-column flex-sm-row align-items-center gap-3">
                  
                  {/* Aspect Ratio Square Graphics Frame */}
                  <img 
                    src={currentSong.artworkUrl100} 
                    alt="" 
                    onError={e => e.target.src = "/default-music.png"} 
                    style={{ width: "90px", height: "90px", borderRadius: "8px", objectFit: "cover" }} 
                  />
                  
                  {/* Track Meta Information Readouts */}
                  <div className="flex-grow-1 text-center text-sm-start w-100">
                    <h5 className="fw-bold mb-1 text-dark">
                      {currentSong.trackName}{" "}
                      <span className="badge bg-primary-subtle text-primary border ms-1" style={{ fontSize: "0.7rem" }}>Library</span>
                    </h5>
                    
                    <p className="m-0 text-muted" style={{ fontSize: "0.85rem" }}>
                      <strong>Artist:</strong> {currentSong.artistName} &nbsp;|&nbsp; <strong>Album:</strong> {currentSong.collectionName}
                    </p>

                    {/* Curated Playlist Integration Sub-Section Controls */}
                    <div className="d-flex align-items-center justify-content-center justify-content-sm-start gap-2 mt-2 pt-2 border-top">
                      <select className="form-select form-select-sm w-auto" style={{ fontSize: "0.8rem", minWidth: "180px" }} value={playlistId} onChange={e => setPlaylistId(e.target.value)}>
                        <option value="">➕ Select Playlist Target</option>
                        {playlists.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                      </select>
                      <button className="btn btn-sm btn-success fw-bold px-3" onClick={async () => {
                        if (!playlistId) return alert("Select a target playlist destination!");
                        await api.put(`/playlists/${playlistId}/add-song`, { songId: currentSong.trackId });
                        alert("Song Added To Playlist Successfully!");
                      }}>Add</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center border p-4 shadow-sm bg-white" style={{ borderRadius: "10px" }}>
              <span>✨</span><h6 className="fw-bold mt-2 text-dark m-0">No Song Selected</h6>
              <small className="text-muted">Choose a track from the sidebar listing to initialize audio streaming parameters.</small>
            </div>
          )}

          {/* Integrated Media Player Layout Attachment */}
          <MusicPlayer currentSong={currentSong} nextSong={() => shiftTrack(1)} previousSong={() => shiftTrack(-1)} />
        </div>

      </div>
    </div>
  );
}

export default Songs;