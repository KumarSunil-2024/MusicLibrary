import { useEffect, useState } from "react";
import api from "../services/api";

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");

  const fetchPlaylists = async () => {
    try {
      const res = await api.get("/playlists");
      
      // 🛠️ ROOT CAUSE CORRECTION: Normalize song sub-arrays right when they arrive from the API
      const sanitizedPlaylists = res.data.map(playlist => ({
        ...playlist,
        songs: (playlist.songs || []).map(s => {
          if (!s) return null;
          
          // Force identify any potential image string variables
          let finalImage = s.image || s.artworkUrl100 || s.artworkUrl || "";
          
          // Wipes out broken local relative paths or blank strings cleanly
          if (!finalImage || typeof finalImage !== "string" || !finalImage.startsWith("http")) {
            finalImage = "/default-music.png";
          }

          return {
            ...s,
            trackId: s._id || s.trackId,
            trackName: s.songName || s.songTitle || s.trackName || "Untitled Track",
            artistName: s.singer || s.artistName || "Unknown Artist",
            artworkUrl: finalImage // Uniformly locks down this key shape for the renderer
          };
        }).filter(Boolean) // Clears ghost null values if a song was deleted from the system database
      }));

      setPlaylists(sanitizedPlaylists);
    } catch (err) { 
      console.error("Error fetching and sanitizing playlists:", err); 
    }
  };

  useEffect(() => { fetchPlaylists(); }, []);

  const handleAction = async (method, url, data = null) => {
    try {
      await api[method](url, data);
      fetchPlaylists();
    } catch (err) { console.error(`Action failed (${url}):`, err); }
  };

  const createPlaylist = () => {
    if (!name.trim()) return alert("Enter Playlist Name");
    handleAction("post", "/playlists", { name });
    setName("");
  };

  const renamePlaylist = (id) => {
    const newName = prompt("Enter New Playlist Name");
    if (newName?.trim()) handleAction("put", `/playlists/${id}`, { name: newName });
  };

  const deletePlaylist = (id) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      handleAction("delete", `/playlists/${id}`);
    }
  };

  return (
    <div className="container py-3" style={{ color: "#2c3e50" }}>
      
      {/* Title Workspace Hub */}
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
        {/* Left Side: Creator Controls Panel */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm border" style={{ backgroundColor: "#f8fafc", borderRadius: "10px" }}>
            <h6 className="fw-bold mb-2" style={{ color: "#1e3a8a" }}>New Collection</h6>
            <div className="d-flex flex-column gap-2">
              <input type="text" className="form-control form-control-sm border" placeholder="Playlist Title..." value={name} onChange={(e) => setName(e.target.value)} />
              <button className="btn btn-sm btn-success fw-bold py-1.5" onClick={createPlaylist}>＋ Create Playlist</button>
            </div>
          </div>
        </div>

        {/* Right Side: Active Playlists Grid */}
        <div className="col-md-8">
          {playlists.length === 0 ? (
            <div className="text-center py-4 rounded border border-secondary border-dashed" style={{ backgroundColor: "#f8fafc" }}>
              <h6 className="m-0 text-muted">No custom playlists created yet.</h6>
            </div>
          ) : (
            playlists.map((p) => {
              const query = search.toLowerCase().trim();
              
              const filteredSongs = p.songs.filter(s => 
                s.trackName.toLowerCase().includes(query) ||
                s.artistName.toLowerCase().includes(query)
              );

              return (
                <div key={p._id} className="card border mb-3 shadow-sm" style={{ borderRadius: "10px", overflow: "hidden" }}>
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
                      filteredSongs.map((song, idx) => (
                        <div key={`${p._id}-${song.trackId || idx}`} className="d-flex justify-content-between align-items-center p-1 rounded mb-1 border-bottom">
                          <div className="d-flex align-items-center gap-2">
                            <small className="text-muted fw-bold ps-1" style={{ width: "15px" }}>{idx + 1}</small>
                            
                            {/* 🎯 RENDERS GUARANTEED SANITIZED ASSETS EVERY TIME */}
                            <img 
                              src={song.artworkUrl} 
                              alt="" 
                              style={{ width: "32px", height: "32px", borderRadius: "4px", objectFit: "cover" }} 
                              onError={(e) => { e.target.src = "/default-music.png"; }} 
                            />
                            
                            <div>
                              <p className="mb-0 fw-bold text-dark" style={{ fontSize: "0.9rem", lineHeight: "1.2" }}>{song.trackName}</p>
                              <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>{song.artistName}</small>
                            </div>
                          </div>
                          <button className="btn btn-sm btn-link text-decoration-none text-danger p-0 pe-1" style={{ fontSize: "0.8rem" }} onClick={() => handleAction("put", `/playlists/${p._id}/remove-song/${song._id || song.trackId}`)}>Remove</button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Playlists;