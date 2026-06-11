import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ManageSongs() {
  // NAVIGATION ROUTING HOOK INSTANCE
  const navigate = useNavigate();

  // COMPONENT ACTIVE STORAGE STATES
  const [songs, setSongs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [adminSearch, setAdminSearch] = useState("");
  const [song, setSong] = useState({
    songName: "", singer: "", albumName: "", musicDirector: "", songUrl: "", image: ""
  });

  // ROLES VALIDATION SECLUSION CHECK
  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    (!user || user.role !== "ADMIN") ? navigate("/dashboard") : fetchSongs();
  }, [navigate]);

  // FETCH MASTER CATALOGUE RECORDS
  const fetchSongs = async () => {
    try {
      const res = await api.get("/songs/admin/all");
      const data = res.data?.data || res.data || [];
      setSongs(Array.isArray(data) ? data : []);
    } catch (err) {
      setSongs([]);
    }
  };

  // MULTI ATTRIBUTE SEARCH FILTER
  const filteredSongs = useMemo(() => {
    const term = adminSearch.toLowerCase().trim();
    return songs.filter(s => !term || 
      s.songName?.toLowerCase().includes(term) ||
      s.singer?.toLowerCase().includes(term) ||
      s.albumName?.toLowerCase().includes(term)
    );
  }, [adminSearch, songs]);

  // VISIBILITY ATTRIBUTE TOGGLE ROUTINE
  const handleToggleVisibility = async (id) => {
    try {
      const res = await api.put(`/songs/${id}/visibility`);
      if (res.data.success) {
        setSongs(prev => prev.map(t => t._id === id ? { ...t, visibility: res.data.song.visibility } : t));
      }
    } catch (err) {
      alert("Toggle visibility failed.");
    }
  };

  // SYNC INPUT MARKUP VALUE
  const handleChange = (e) => setSong({ ...song, [e.target.name]: e.target.value });

  // PURGE COMPONENT FORM VALUES
  const resetForm = () => {
    setSong({ songName: "", singer: "", albumName: "", musicDirector: "", songUrl: "", image: "" });
    setEditId(null);
  };

  // COMMIT MODIFIED ASSET ENTRY
  const saveTrack = async (e) => {
    e.preventDefault();
    if (!song.songName.trim() || !song.singer.trim()) return alert("Name and Singer required!");
    try {
      editId ? await api.put(`/songs/${editId}`, song) : await api.post("/songs", song);
      resetForm();
      fetchSongs();
    } catch (err) {
      alert("Registry write failed.");
    }
  };

  // PERMANENTLY DROP CHOSEN TRACK
  const deleteTrack = async (id) => {
    if (window.confirm("Drop this track permanently?")) {
      try { await api.delete(`/songs/${id}`); fetchSongs(); } catch { alert("Deletion failed."); }
    }
  };

  // POPULATE FORM FIELD ENTRIES
  const startEdit = (item) => {
    setEditId(item._id);
    setSong({ ...item });
  };

  return (
    <div className="container py-3" style={{ color: "#1e293b", fontFamily: "system-ui" }}>
      
      {/* ULTRA-MODERN COMPACT ACTION BANNER */}
      <div className="p-3 mb-3 text-white d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 shadow-sm"
           style={{ background: "linear-gradient(135deg, #1e1e35 0%, #2a2a55 100%)", borderRadius: "12px" }}>
        <div>
          <h5 className="fw-bold m-0">🎨 Operations Studio</h5>
          <small className="text-white-50">Create, publish, or purge core assets</small>
        </div>
        <div className="d-flex gap-2 w-100 w-sm-auto" style={{ maxWidth: "260px" }}>
          <input type="text" className="form-control form-control-sm bg-white-10 text-white border-0 px-3 custom-placeholder" 
                 style={{ borderRadius: "8px", background: "rgba(255,255,255,0.1)" }}
                 placeholder="Search registry..." value={adminSearch} onChange={(e) => setAdminSearch(e.target.value)} / >
        </div>
      </div>

      <div className="row g-3">
        {/* LEFT COMPACT FORM PANEL */}
        <div className="col-12 col-md-4">
          <form onSubmit={saveTrack} className="card p-3 border-0 shadow-sm bg-white" style={{ borderRadius: "12px" }}>
            <h6 className="fw-bold text-primary mb-3">{editId ? "📝 Update Metadata" : "➕ Add New Asset"}</h6>
            <div className="d-flex flex-column gap-2">
              {Object.keys(song).map(f => (
                <input key={f} type="text" name={f} value={song[f]} onChange={handleChange}
                       className="form-control form-control-sm border-light-subtle py-2" style={{ borderRadius: "6px", fontSize: "0.8rem" }}
                       placeholder={f.replace("songName","Track Name").replace("singer","Singer").replace("albumName","Album").replace("musicDirector","Director").replace("songUrl","Audio URL").replace("image","Image URL")} />
              ))}
              <div className="d-flex gap-1.5 mt-2">
                <button type="submit" className={`btn btn-sm text-white fw-bold w-100 ${editId ? "btn-warning" : "btn-dark"}`}>{editId ? "Apply" : "Save Asset"}</button>
                {editId && <button type="button" className="btn btn-sm btn-light border" onClick={resetForm}>Cancel</button>}
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT MODERN GRID CONTAINER */}
        <div className="col-12 col-md-8">
          <div className="d-flex flex-column gap-2" style={{ maxHeight: "490px", overflowY: "auto", paddingRight: "4px" }}>
            {filteredSongs.length === 0 ? (
              <div className="text-center p-5 text-muted bg-white border rounded-3 small">No matching master track items mapped.</div>
            ) : (
              filteredSongs.map((item) => (
                <div key={item._id} className="d-flex align-items-center justify-content-between p-2 bg-white border-0 shadow-xs rounded-3 transition-all list-card"
                     style={{ opacity: item.visibility !== false ? 1 : 0.6, borderLeft: item.visibility !== false ? "4px solid #10b981" : "4px solid #94a3b8" }}>
                  
                  {/* COMPACT INTERACTIVE MEDIA MODULE */}
                  <div className="d-flex align-items-center gap-2 style-truncate-box" style={{ minWidth: 0 }}>
                    <img src={item.image || "https://placehold.co/45"} alt="" style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }} />
                    <div style={{ minWidth: 0 }}>
                      <p className="m-0 fw-bold text-dark text-truncate small" style={{ maxWidth: "260px" }}>{item.songName}</p>
                      <small className="text-muted font-monospace d-block" style={{ fontSize: "0.7rem" }}>{item.singer} • {item.albumName || "Single"}</small>
                    </div>
                  </div>

                  {/* MINIMAL BUTTON ACTION PACKET */}
                  <div className="d-flex gap-1">
                    <button className={`btn btn-xs fw-bold px-2.5 py-1 border-0 ${item.visibility !== false ? "btn-light text-secondary" : "btn-success text-white"}`}
                            style={{ fontSize: "0.7rem", borderRadius: "6px" }} onClick={() => handleToggleVisibility(item._id)}>
                      {item.visibility !== false ? "🔒 Hide" : "🔓 Show"}
                    </button>
                    <button className="btn btn-xs btn-light border shadow-sm px-2.5 py-1" style={{ fontSize: "0.7rem", borderRadius: "6px" }} onClick={() => startEdit(item)}>🔧</button>
                    <button className="btn btn-xs btn-light border shadow-sm px-2.5 py-1 text-danger" style={{ fontSize: "0.7rem", borderRadius: "6px" }} onClick={() => deleteTrack(item._id)}>🗑️</button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        .transition-all { transition: all 0.2s ease-in-out; }
        .list-card:hover { transform: translateX(2px); background-color: #fafafa !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .custom-placeholder::placeholder { color: rgba(255,255,255,0.4) !important; }
        .btn-xs { padding: 0.25rem 0.4rem; font-size: 0.75rem; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>
    </div>
  );
}

export default ManageSongs;