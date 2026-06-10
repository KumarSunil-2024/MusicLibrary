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
    <div className="container py-3" style={{ color: "#2c3e50" }}>
      
      {/* PLAYLIST SECTION TOP HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold m-0" style={{ letterSpacing: "-0.5px", color: "#1e3a8a" }}>🎧 My Playlists</h2>
          <small className="text-muted">Manage and filter your musical collections easily.</small>
        </div>
        {/* PLAYLIST FILTER SEARCH INPUT */}
        <div style={{ maxWidth: "340px", width: "100%" }}>
          <input 
            type="text" 
            className="form-control border shadow-sm" 
            placeholder="🔍 Search tracks inside..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="row g-3">
        {/* PLAYLIST CREATION BOX CONTAINER */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm border" style={{ backgroundColor: "#f8fafc", borderRadius: "10px" }}>
            <h6 className="fw-bold mb-2" style={{ color: "#1e3a8a" }}>New Collection</h6>
            <div className="d-flex flex-column gap-2">
              <input 
                type="text" 
                className="form-control form-control-sm border" 
                placeholder="Playlist Title..." 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
              <button className="btn btn-sm btn-success fw-bold py-2" onClick={createPlaylist}>＋ Create Playlist</button>
            </div>
          </div>
        </div>

        {/* CUSTOM PLAYLISTS LIST DISPLAY */}
        <div className="col-md-8 d-flex flex-column gap-3">
          {playlists.length === 0 ? (
            <div className="text-center py-4 rounded border border-secondary border-dashed bg-light">
              <h6 className="m-0 text-muted">No custom playlists created yet.</h6>
            </div>
          ) : (
            playlists.map((p) => {
              const localFilteredSongs = p.songs.filter(s => 
                s.trackName.toLowerCase().includes(cleanQuery) || s.artistName.toLowerCase().includes(cleanQuery)
              );

              return (
                <div key={p._id} className="card border shadow-sm" style={{ borderRadius: "10px", overflow: "hidden" }}>
                  
                  {/* COLLECTION CARD ACTION ACTIONS */}
                  <div className="px-3 py-2 d-flex justify-content-between align-items-center border-bottom bg-light">
                    <div style={{ minWidth: 0 }} className="me-2">
                      <h5 className="fw-bold m-0 d-inline-block text-dark text-truncate align-middle" style={{ maxWidth: "160px" }}>{p.name}</h5>
                      <span className="badge bg-secondary rounded-pill ms-2 align-middle" style={{ fontSize: "0.7rem" }}>{p.songs.length} items</span>
                    </div>
                    <div className="d-flex gap-1 flex-shrink-0">
                      <button className="btn btn-sm btn-outline-primary py-0.5 px-2" style={{ fontSize: "0.75rem" }} onClick={() => renamePlaylist(p._id)}>Rename</button>
                      <button className="btn btn-sm btn-danger py-0.5 px-2" style={{ fontSize: "0.75rem" }} onClick={() => deletePlaylist(p._id)}>Delete</button>
                    </div>
                  </div>

                  {/* RENDER INDIVIDUAL TRACK ITEMS */}
                  <div className="card-body p-2 bg-white">
                    {localFilteredSongs.length === 0 ? (
                      <p className="text-muted m-0 py-2 text-center" style={{ fontSize: "0.85rem" }}>No matching songs found</p>
                    ) : (
                      localFilteredSongs.map((song, idx) => {
                        const isCurrent = currentSong?.trackId === song.trackId;
                        
                        return (
                          <div 
                            key={`${p._id}-${song.trackId || idx}`} 
                            className="d-flex justify-content-between align-items-center p-1 rounded mb-1 border-bottom"
                            onClick={() => setCurrentSong(song)}
                            style={{ 
                              cursor: "pointer", 
                              backgroundColor: isCurrent ? "#edf2f7" : "transparent"
                            }}
                          >
                            <div className="d-flex align-items-center gap-2 text-truncate flex-grow-1">
                              <small className={`${isCurrent ? "text-primary fw-bold" : "text-muted"} text-center`} style={{ width: "25px" }}>
                                {isCurrent ? "▶" : idx + 1}
                              </small>
                              
                              <img src={song.artworkUrl} alt="" style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }} />
                              
                              <div className="text-truncate" style={{ minWidth: 0 }}>
                                <p className={`mb-0 fw-bold text-truncate ${isCurrent ? "text-primary" : "text-dark"}`} style={{ fontSize: "0.85rem", lineHeight: "1.2" }}>{song.trackName}</p>
                                <small className="text-muted d-block text-truncate" style={{ fontSize: "0.75rem" }}>{song.artistName}</small>
                              </div>
                            </div>
                            
                            {/* REMOVE SONG FROM COLLECTION */}
                            <button 
                              className="btn btn-sm btn-link text-decoration-none text-danger p-0 px-2 flex-shrink-0" 
                              style={{ fontSize: "0.75rem" }} 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                removeSongFromPlaylist(p._id, song._id || song.trackId);
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
          
          {/* HOOK TARGET PLAYBACK CONSOLE */}
          <MusicPlayer currentSong={currentSong} nextSong={() => shiftTrack(1)} previousSong={() => shiftTrack(-1)} />
        </div>
      </div>
    </div>
  );
}

export default Playlists;