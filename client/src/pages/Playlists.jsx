import { useEffect, useState, useMemo, useCallback } from "react";
import MusicPlayer from "../pages/MusicPlayer"; 
import api from "../services/api";

function Playlists() {
  // COMPONENT ACTIVE STORAGE STATES
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [currentSong, setCurrentSong] = useState(null); 

  // FETCH PLAYLISTS FROM BACKEND
  const fetchPlaylists = useCallback(async () => {
    try {
      const res = await api.get("/playlists");
      const rawData = res.data || [];

      // SANITIZE TRACK KEY MAPPINGS
      const sanitized = rawData.map(playlist => {
        const rawSongs = playlist.songs || [];
        
        const standardSongs = rawSongs.map(s => {
          if (!s) return null;
          return {
            _id: s._id,
            trackId: s.trackId || s._id,
            trackName: s.trackName || s.songName || s.songTitle || "Untitled Track",
            artistName: s.artistName || s.singer || "Unknown Artist",
            artworkUrl: s.artworkUrl || s.image || s.artworkUrl100 || "https://placehold.co/36",
            previewUrl: s.previewUrl || s.songUrl 
          };
        }).filter(Boolean);

        return { ...playlist, songs: standardSongs };
      });

      setPlaylists(sanitized);
    } catch (err) { 
      console.error("Error fetching playlists:", err); 
    }
  }, []);

  // INITIAL COMPONENT RUN MOUNT
  useEffect(() => { 
    fetchPlaylists(); 
  }, [fetchPlaylists]);

  // CREATE NEW CUSTOM COLLECTION
  const createPlaylist = async () => {
    if (!name.trim()) return alert("Enter Playlist Name");
    try {
      await api.post("/playlists", { name: name.trim() });
      setName("");
      fetchPlaylists();
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  // RENAME CHOSEN PLAYLIST INSTANCE
  const renamePlaylist = async (id) => {
    const newName = prompt("Enter New Playlist Name");
    if (!newName?.trim()) return;
    try {
      await api.put(`/playlists/${id}`, { name: newName.trim() });
      fetchPlaylists();
    } catch (err) {
      console.error("Rename failed:", err);
    }
  };

  // DELETE CUSTOM COLLECTION PERMANENTLY
  const deletePlaylist = async (id) => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) return;
    try {
      await api.delete(`/playlists/${id}`);
      fetchPlaylists();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // REMOVE TRACK FROM PLAYLIST
  const removeSongFromPlaylist = async (playlistId, songId) => {
    try {
      if (currentSong && (currentSong.trackId === songId || currentSong._id === songId)) {
        setCurrentSong(null); 
      }
      await api.put(`/playlists/${playlistId}/remove-song/${songId}`, { songId });
      fetchPlaylists();
    } catch (err) {
      console.error("Remove song failed:", err);
    }
  };

  // MEMOIZE SANITIZED USER SEARCH
  const cleanQuery = useMemo(() => search.toLowerCase().trim(), [search]);

  // FILTER TRACK ENGINE QUEUE
  const filteredQueue = useMemo(() => {
    return playlists.flatMap(p => p.songs).filter(s => 
      s.trackName.toLowerCase().includes(cleanQuery) || 
      s.artistName.toLowerCase().includes(cleanQuery)
    );
  }, [playlists, cleanQuery]);

  // SHIFT TRACK INDEX POSITION
  const shiftTrack = (step) => {
    if (!currentSong || filteredQueue.length === 0) return;
    
    const currentIndex = filteredQueue.findIndex(s => s.trackId === currentSong.trackId);
    const nextIndex = currentIndex + step;
    
    if (nextIndex >= 0 && nextIndex < filteredQueue.length) {
      setCurrentSong(filteredQueue[nextIndex]);
    }
  };

  return (
    <div className="container py-4" style={{ color: "#1e293b", fontFamily: "system-ui, sans-serif" }}>
      
      {/* GLOSSY INDIGO HEADER CARD */}
      <div className="p-4 mb-4 text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 shadow-sm"
           style={{ background: "linear-gradient(135deg, #1e1e38 0%, #2d2d5a 100%)", borderRadius: "16px" }}>
        <div>
          <h3 className="fw-black m-0 d-flex align-items-center gap-2" style={{ letterSpacing: "-0.5px" }}>
            <span>📂</span> My Playlist
          </h3>
          <p className="m-0 mt-1 text-white-50" style={{ fontSize: "0.85rem" }}>Create custom audio folders and manage tracks</p>
        </div>
        <div style={{ maxWidth: "300px", width: "100%" }}>
          <input type="text" className="form-control form-control-sm border-0 px-3 search-input" 
                 style={{ borderRadius: "10px", background: "rgba(255,255,255,0.11)", color: "#fff" }}
                 placeholder="🔍 Search tracks inside..." value={search} onChange={(e) => setSearch(e.target.value)} / >
        </div>
      </div>

      <div className="row g-4">
        {/* LEFT PANEL: MINIMAL CREATION STUDIO */}
        <div className="col-12 col-md-4">
          <div className="card p-3 border-0 shadow-sm bg-white text-center text-sm-start" style={{ borderRadius: "14px" }}>
            <h6 className="fw-bold mb-3 text-dark">➕ Creat New Playlist</h6>
            <div className="d-flex flex-column gap-2">
              <input type="text" className="form-control border-light-subtle py-2" style={{ borderRadius: "8px", fontSize: "0.85rem" }}
                     placeholder="New playlist name..." value={name} onChange={(e) => setName(e.target.value)} / >
              <button className="btn btn-dark fw-bold py-2 shadow-xs" style={{ borderRadius: "8px", fontSize: "0.85rem" }} onClick={createPlaylist}>
                Create
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: ASYMMETRICAL PLAYLIST DECKS */}
        <div className="col-12 col-md-8 d-flex flex-column gap-3">
          {playlists.length === 0 ? (
            <div className="text-center py-5 rounded-4 border-2 border-dashed bg-light text-muted small">
              No custom playlists discovered on this profile node.
            </div>
          ) : (
            playlists.map((p) => {
              const localFilteredSongs = p.songs.filter(s => 
                s.trackName.toLowerCase().includes(cleanQuery) || s.artistName.toLowerCase().includes(cleanQuery)
              );

              return (
                <div key={p._id} className="card border-0 shadow-sm bg-white" style={{ borderRadius: "14px", overflow: "hidden" }}>
                  
                  {/* COLLECTION CARD HEADER ACCENT */}
                  <div className="px-3 py-2.5 d-flex justify-content-between align-items-center bg-light border-0">
                    <div style={{ minWidth: 0 }}>
                      <span className="fw-bold text-dark h6 m-0 text-truncate d-inline-block align-middle" style={{ maxWidth: "200px" }}>{p.name}</span>
                      <span className="badge bg-secondary-subtle text-secondary rounded-pill ms-2 align-middle" style={{ fontSize: "0.65rem" }}>{p.songs.length} audio</span>
                    </div>
                    <div className="d-flex gap-1">
                      <button className="btn btn-xs btn-white border shadow-xs text-primary px-2.5 py-1 fw-semibold" onClick={() => renamePlaylist(p._id)}>✏️</button>
                      <button className="btn btn-xs btn-white border shadow-xs text-danger px-2.5 py-1 fw-semibold" onClick={() => deletePlaylist(p._id)}>🗑️</button>
                    </div>
                  </div>

                  {/* RENDER INDIVIDUAL ROW STREAM NODES */}
                  <div className="p-2 bg-white">
                    {localFilteredSongs.length === 0 ? (
                      <p className="text-muted m-0 py-3 text-center small">No tracking audio matches available.</p>
                    ) : (
                      localFilteredSongs.map((song, idx) => {
                        const isCurrent = currentSong?.trackId === song.trackId;
                        
                        return (
                          <div key={`${p._id}-${song.trackId || idx}`} onClick={() => setCurrentSong(song)}
                               className="d-flex justify-content-between align-items-center p-2 rounded-3 mb-1 transition-all song-row"
                               style={{ cursor: "pointer", backgroundColor: isCurrent ? "#f1f5f9" : "transparent" }}>
                            
                            <div className="d-flex align-items-center gap-2.5 text-truncate flex-grow-1" style={{ minWidth: 0 }}>
                              <small className={`text-center font-monospace ${isCurrent ? "text-success fw-bold animate-pulse" : "text-muted"}`} style={{ width: "20px", fontSize: "0.8rem" }}>
                                {isCurrent ? "▶" : idx + 1}
                              </small>
                              
                              <img src={song.artworkUrl} alt="" style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }} />
                              
                              <div style={{ minWidth: 0 }}>
                                <p className={`m-0 fw-bold text-truncate ${isCurrent ? "text-success" : "text-dark"}`} style={{ fontSize: "0.85rem", lineHeight: "1.2" }}>{song.trackName}</p>
                                <small className="text-muted d-block text-truncate" style={{ fontSize: "0.72rem" }}>{song.artistName}</small>
                              </div>
                            </div>
                            
                            <button className="btn btn-sm text-decoration-none text-danger border-0 opacity-75 hover-reveal px-2" style={{ fontSize: "0.7rem", fontWeight: "600" }} 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      removeSongFromPlaylist(p._id, song._id || song.trackId);
                                    }}>
                              Delete
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                </div>
              );
            })
          )}
          
          {/* FLOATING REAL-TIME MEDIA HUB PLAYBACK */}
          <MusicPlayer currentSong={currentSong} nextSong={() => shiftTrack(1)} previousSong={() => shiftTrack(-1)} />
        </div>
      </div>

      {/* COMPONENT GLOBAL HOVER TRANSFORM INTERFACES */}
      <style>{`
        .transition-all { transition: all 0.2s ease-in-out; }
        .song-row:hover { background-color: #f8fafc !important; transform: translateX(2px); }
        .search-input::placeholder { color: rgba(255,255,255,0.4) !important; }
        .search-input:focus { background: rgba(255,255,255,0.16) !important; box-shadow: none !important; outline: none; }
        .fw-black { font-weight: 900; }
        .btn-xs { font-size: 0.7rem; border-radius: 6px; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
}

export default Playlists;