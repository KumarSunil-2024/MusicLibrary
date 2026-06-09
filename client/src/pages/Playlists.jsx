import { useEffect, useState, useCallback, useMemo } from "react";
import MusicPlayer from "../pages/MusicPlayer"; 
import api from "../services/api";

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [currentSong, setCurrentSong] = useState(null); 

  // Fetches and cleanly maps all raw schema keys immediately upon receipt
  const fetchPlaylists = async () => {
    try {
      const res = await api.get("/playlists");
      
      const sanitizedPlaylists = res.data.map(playlist => ({
        ...playlist,
        songs: (playlist.songs || []).map(s => {
          if (!s) return null;
          let finalImage = s.image || s.artworkUrl100 || s.artworkUrl || "";
          if (!finalImage || typeof finalImage !== "string" || !finalImage.startsWith("http")) {
            finalImage = "/default-music.png";
          }

          return {
            ...s,
            trackId: s._id || s.trackId,
            trackName: s.songName || s.songTitle || s.trackName || "Untitled Track",
            artistName: s.singer || s.artistName || "Unknown Artist",
            artworkUrl: finalImage,
            previewUrl: s.songUrl || s.previewUrl 
          };
        }).filter(Boolean)
      }));

      setPlaylists(sanitizedPlaylists);
    } catch (err) { 
      console.error("Error fetching playlists:", err); 
    }
  };

  useEffect(() => { fetchPlaylists(); }, []);

  // Centralized wrapper for structural API data mutations
  const handleAction = async (method, url, data = null) => {
    try {
      await api[method](url, data);
      await fetchPlaylists();
    } catch (err) { 
      console.error(`Action failed (${url}):`, err); 
    }
  };

  const createPlaylist = () => {
    if (!name.trim()) return alert("Enter Playlist Name");
    handleAction("post", "/playlists", { name: name.trim() });
    setName("");
  };

  const renamePlaylist = (id) => {
    const newName = prompt("Enter New Playlist Name");
    if (newName?.trim()) handleAction("put", `/playlists/${id}`, { name: newName.trim() });
  };

  const deletePlaylist = (id) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      handleAction("delete", `/playlists/${id}`);
    }
  };

  // Memoized lowercase clean search filter query tracking
  const cleanQuery = useMemo(() => search.toLowerCase().trim(), [search]);

  // Unified global track skip queue manager
  const shiftTrack = useCallback((step) => {
    const activeQueue = playlists.flatMap(p => 
      p.songs.filter(s => s.trackName.toLowerCase().includes(cleanQuery) || s.artistName.toLowerCase().includes(cleanQuery))
    );

    if (!currentSong || !activeQueue.length) return;
    const idx = activeQueue.findIndex(s => s.trackId === currentSong.trackId) + step;
    if (idx >= 0 && idx < activeQueue.length) setCurrentSong(activeQueue[idx]);
  }, [currentSong, playlists, cleanQuery]);

  return (
    <div className="container py-3" style={{ color: "#2c3e50" }}>
      
      {/* Title Hub Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
        <div>
          <h2 className="fw-bold m-0" style={{ letterSpacing: "-0.5px", color: "#1e3a8a" }}>🎧 My Playlists</h2>
          <small className="text-muted">Manage and filter your musical collections easily.</small>
        </div>
        <div style={{ maxWidth: "300px", width: "100%" }}>
          <input type="text" className="form-control form-control-sm border shadow-sm" placeholder="🔍 Search tracks inside..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="row g-3">
        
        {/* Left Column: Playlist Creation Deck */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm border" style={{ backgroundColor: "#f8fafc", borderRadius: "10px" }}>
            <h6 className="fw-bold mb-2" style={{ color: "#1e3a8a" }}>New Collection</h6>
            <div className="d-flex flex-column gap-2">
              <input type="text" className="form-control form-control-sm border" placeholder="Playlist Title..." value={name} onChange={(e) => setName(e.target.value)} />
              <button className="btn btn-sm btn-success fw-bold py-1.5" onClick={createPlaylist}>＋ Create Playlist</button>
            </div>
          </div>
        </div>

        {/* Right Column: Playlists + Audio Engine Player Stack */}
        <div className="col-md-8 d-flex flex-column gap-3">
          {playlists.length === 0 ? (
            <div className="text-center py-4 rounded border border-secondary border-dashed bg-light">
              <h6 className="m-0 text-muted">No custom playlists created yet.</h6>
            </div>
          ) : (
            playlists.map((p) => {
              const filteredSongs = p.songs.filter(s => 
                s.trackName.toLowerCase().includes(cleanQuery) || s.artistName.toLowerCase().includes(cleanQuery)
              );

              return (
                <div key={p._id} className="card border shadow-sm" style={{ borderRadius: "10px", overflow: "hidden" }}>
                  <div className="px-3 py-2 d-flex justify-content-between align-items-center border-bottom" style={{ backgroundColor: "#edf2f7" }}>
                    <div>
                      <h5 className="fw-bold m-0 d-inline-block text-dark me-2">{p.name}</h5>
                      <span className="badge bg-secondary rounded-pill" style={{ fontSize: "0.75rem" }}>{p.songs.length} items</span>
                    </div>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm px-2 py-0.5 btn-outline-primary" style={{ fontSize: "0.8rem" }} onClick={() => renamePlaylist(p._id)}>Rename</button>
                      <button className="btn btn-sm px-2 py-0.5 btn-danger" style={{ fontSize: "0.8rem" }} onClick={() => deletePlaylist(p._id)}>Delete</button>
                    </div>
                  </div>

                  <div className="card-body p-2" style={{ backgroundColor: "#ffffff" }}>
                    {filteredSongs.length === 0 ? (
                      <p className="text-muted m-0 py-2 text-center" style={{ fontSize: "0.85rem" }}>No matching songs found</p>
                    ) : (
                      filteredSongs.map((song, idx) => {
                        const isCurrent = currentSong?.trackId === song.trackId;
                        
                        return (
                          <div 
                            key={`${p._id}-${song.trackId || idx}`} 
                            className="d-flex justify-content-between align-items-center p-1 rounded mb-1 border-bottom animate-row"
                            onClick={() => setCurrentSong(song)}
                            style={{ 
                              cursor: "pointer", 
                              backgroundColor: isCurrent ? "#edf2f7" : "transparent",
                              transition: "background-color 0.2s ease"
                            }}
                          >
                            <div className="d-flex align-items-center gap-2 text-truncate">
                              <small className={`${isCurrent ? "text-primary fw-bold" : "text-muted"} text-center`} style={{ width: "20px" }}>
                                {isCurrent ? "▶" : idx + 1}
                              </small>
                              
                              <img src={song.artworkUrl} alt="" style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }} onError={(e) => { e.target.src = "/default-music.png"; }} />
                              
                              <div className="text-truncate">
                                <p className={`mb-0 fw-bold text-truncate ${isCurrent ? "text-primary" : "text-dark"}`} style={{ fontSize: "0.9rem", lineHeight: "1.2" }}>{song.trackName}</p>
                                <small className="text-muted d-block text-truncate" style={{ fontSize: "0.75rem" }}>{song.artistName}</small>
                              </div>
                            </div>
                            
                            {/* 🛠️ BUG FIX: Clears player state if active track is dropped */}
                            <button 
                              className="btn btn-sm btn-link text-decoration-none text-danger p-0 pe-2 ms-2" 
                              style={{ fontSize: "0.8rem" }} 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                if (currentSong && currentSong.trackId === song.trackId) {
                                  setCurrentSong(null);
                                }
                                handleAction("put", `/playlists/${p._id}/remove-song/${song._id || song.trackId}`); 
                              }}
                            >
                              Remove
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
          
          <MusicPlayer currentSong={currentSong} nextSong={() => shiftTrack(1)} previousSong={() => shiftTrack(-1)} />
        </div>

      </div>
    </div>
  );
}

export default Playlists;