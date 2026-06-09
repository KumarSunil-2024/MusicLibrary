import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

function ManageSongs() {
  const user = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();
  if (user?.role !== "ADMIN") return <Navigate to="/dashboard" replace />;

  const [songs, setSongs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [song, setSong] = useState({
    songName: "", singer: "", albumName: "", musicDirector: "", songUrl: "", image: "",
  });

  const handleCatalogAction = useCallback(async (method, url, data = null) => {
    try {
      const res = await api[method](url, data);
      
      if (method === "get") {
        setSongs(res.data);
      } else {
        alert("Operation Completed Successfully!");
        resetForm();
        // 🔄 FIXED: Points straight to the correct admin refresh payload map
        handleCatalogAction("get", "/songs/admin/all");
      }
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  }, []);

  // 🔄 FIXED: Initial pull targets the full admin catalog route
  useEffect(() => { handleCatalogAction("get", "/songs/admin/all"); }, [handleCatalogAction]);

  const handleChange = (e) => setSong({ ...song, [e.target.name]: e.target.value });
  
  const resetForm = () => {
    setSong({ songName: "", singer: "", albumName: "", musicDirector: "", songUrl: "", image: "" });
    setEditId(null);
  };

  const saveTrack = (e) => {
    e.preventDefault();
    if (!song.songName.trim() || !song.singer.trim()) return alert("Name and Singer required!");
    editId ? handleCatalogAction("put", `/songs/${editId}`, song) : handleCatalogAction("post", "/songs", song);
  };

  const deleteTrack = (id) => {
    if (window.confirm("Delete this track?")) {
      api.delete(`/songs/${id}`).then(() => handleCatalogAction("get", "/songs/admin/all"));
    }
  };

  return (
    <div className="container py-3" style={{ color: "#2c3e50" }}>
      <div className="p-3 mb-3 border shadow-sm d-flex justify-content-between align-items-center bg-light" style={{ borderRadius: "10px" }}>
        <span className="badge bg-dark rounded-pill px-3 py-2">Tracks: {songs.length}</span>
      </div>

      <div className="row g-3">
        <div className="col-lg-4">
          <form onSubmit={saveTrack} className="card p-3 shadow-sm border bg-white" style={{ borderRadius: "10px" }}>
            <h6 className="fw-bold mb-2 text-primary">{editId ? "📝 Edit Track" : "➕ Add New Track"}</h6>
            <div className="d-flex flex-column gap-2" style={{ fontSize: "0.82rem" }}>
              {["songName", "singer", "albumName", "musicDirector", "songUrl", "image"].map((f) => (
                <div key={f}>
                  <label className="text-muted fw-semibold small text-capitalize">{f.replace("image", "Artwork Image URL")}</label>
                  <input type="text" name={f} value={song[f]} onChange={handleChange} className="form-control form-control-sm border" placeholder={`Enter ${f}...`} />
                </div>
              ))}
              <div className="d-flex gap-2 mt-2">
                <button type="submit" className={`btn btn-sm fw-bold flex-grow-1 ${editId ? "btn-warning" : "btn-success"}`}>{editId ? "Update" : "Save"}</button>
                {editId && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={resetForm}>Cancel</button>}
              </div>
            </div>
          </form>
        </div>

        <div className="col-lg-8">
          <div className="card border shadow-sm" style={{ borderRadius: "10px", overflow: "hidden" }}>
            <div className="px-3 py-2 border-bottom bg-light"><h6 className="fw-bold m-0 text-dark">Active Track Registries</h6></div>
            <div className="card-body p-0 bg-white" style={{ height: "465px", overflowY: "auto" }}>
              <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.85rem" }}>
                <thead className="table-light text-uppercase" style={{ fontSize: "0.75rem" }}>
                  <tr><th className="ps-3">Track Info</th><th>Album</th><th className="text-end pe-3">Actions</th></tr>
                </thead>
                <tbody>
                  {songs.map((item) => (
                    <tr key={item._id}>
                      <td className="ps-3">
                        <div className="d-flex align-items-center gap-2">
                          <img src={item.image || "/default-music.png"} alt="" style={{ width: "34px", height: "34px", borderRadius: "5px", objectFit: "cover" }} onError={e => e.target.src = "/default-music.png"} />
                          <div><p className="mb-0 fw-bold">{item.songName}</p><small className="text-muted">{item.singer}</small></div>
                        </div>
                      </td>
                      <td>{item.albumName || "Single"}</td>
                      <td className="text-end pe-3">
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => { setEditId(item._id); setSong({ ...item, image: item.image || "" }); }}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteTrack(item._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageSongs;