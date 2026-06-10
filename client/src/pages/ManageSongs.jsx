import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ManageSongs() {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [song, setSong] = useState({
    songName: "",
    singer: "",
    albumName: "",
    musicDirector: "",
    songUrl: "",
    image: "",
  });

  // 1. SAFE SECURE ROLE CHECK (Runs once immediately)
  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if (!user || user.role !== "ADMIN") {
      navigate("/dashboard");
    } else {
      fetchSongs(); // Load data only if user is an Admin
    }
  }, [navigate]);

  // 2. EXPLICIT API FETCH WITH DATA-WRAPPING SAFETY GUARDS
  const fetchSongs = async () => {
    try {
      const res = await api.get("/songs/admin/all");

      // 🎯 THE CRITICAL FIX: Extract array safely from { success: true, data: [...] } layout
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setSongs(res.data.data);
      } else if (Array.isArray(res.data)) {
        setSongs(res.data);
      } else {
        setSongs([]); // Absolute fallback to shield against map crashes
      }
    } catch (err) {
      console.error("Database connection failed:", err.message);
      setSongs([]); // Ensure state remains an array even on network drops
    }
  };

  // 3. VISIBILITY ATTRIBUTE TOGGLE ACTION ROUTINE
  const handleToggleVisibility = async (songId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.put(
        `/songs/${songId}/visibility`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        // Map alterations dynamically inside our state tracker element
        setSongs((prevSongs) =>
          prevSongs.map((track) =>
            track._id === songId
              ? { ...track, visibility: res.data.song.visibility }
              : track,
          ),
        );
      }
    } catch (err) {
      alert("Could not modify visibility matrix attributes.");
    }
  };

  const handleChange = (e) => {
    setSong({ ...song, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setSong({
      songName: "",
      singer: "",
      albumName: "",
      musicDirector: "",
      songUrl: "",
      image: "",
    });
    setEditId(null);
  };

  // 4. CLEAN TRACK SAVE LOGIC
  const saveTrack = async (e) => {
    e.preventDefault();
    if (!song.songName.trim() || !song.singer.trim()) {
      return alert("Track Title and Artist are required!");
    }

    try {
      if (editId) {
        await api.put(`/songs/${editId}`, song);
      } else {
        await api.post("/songs", song);
      }
      alert("Operation completed successfully!");
      resetForm();
      fetchSongs();
    } catch (err) {
      alert("Could not update registry.");
    }
  };

  // 5. EXPLICIT DELETE TRACK
  const deleteTrack = async (id) => {
    if (!window.confirm("Drop this track permanently?")) return;

    try {
      await api.delete(`/songs/${id}`);
      fetchSongs();
    } catch (err) {
      alert("Failed to delete selected item.");
    }
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setSong({
      songName: item.songName || "",
      singer: item.singer || "",
      albumName: item.albumName || "",
      musicDirector: item.musicDirector || "",
      songUrl: item.songUrl || "",
      image: item.image || "",
    });
  };

  return (
    <div className="container py-3" style={{ color: "#2c3e50" }}>
      {/* HEADER SECTION (Fully Responsive Layout) */}
      <div
        className="p-3 mb-3 border shadow-sm d-flex flex-column flex-sm-row justify-content-between align-items-sm-center bg-light gap-2"
        style={{ borderRadius: "10px" }}
      >
        <div>
          <h4 className="fw-bold m-0">📁 Global Catalog Configuration</h4>
          <small className="text-muted">
            Manage song fields using image URLs.
          </small>
        </div>
        <div>
          <span className="badge bg-dark rounded-pill px-3 py-2">
            Total System Tracks: {Array.isArray(songs) ? songs.length : 0}
          </span>
        </div>
      </div>

      <div className="row g-3">
        {/* LEFT COLUMN: FORM PANEL */}
        <div className="col-lg-4">
          <form
            onSubmit={saveTrack}
            className="card p-3 shadow-sm border bg-white"
            style={{ borderRadius: "10px" }}
          >
            <h6 className="fw-bold mb-2 text-primary">
              {editId ? "📝 Amending Registry" : "➕ Upload New Track"}
            </h6>
            <div
              className="d-flex flex-column gap-2"
              style={{ fontSize: "0.82rem" }}
            >
              {[
                "songName",
                "singer",
                "albumName",
                "musicDirector",
                "songUrl",
                "image",
              ].map((field) => (
                <div key={field}>
                  <label className="text-muted fw-semibold small text-capitalize">
                    {field
                      .replace("Name", " Title")
                      .replace("Url", " Link")
                      .replace("image", "Artwork Image URL")}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={song[field]}
                    onChange={handleChange}
                    className="form-control form-control-sm border"
                    placeholder={`Enter track ${field}...`}
                  />
                </div>
              ))}

              <div className="d-flex gap-2 mt-2">
                <button
                  type="submit"
                  className={`btn btn-sm fw-bold flex-grow-1 ${editId ? "btn-warning" : "btn-success"}`}
                >
                  {editId ? "Apply Changes" : "Save Track"}
                </button>
                {editId && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: DATA LIST VIEW */}
        <div className="col-lg-8">
          <div
            className="card border shadow-sm"
            style={{ borderRadius: "10px", overflow: "hidden" }}
          >
            <div className="px-3 py-2 border-bottom bg-light">
              <h6 className="fw-bold m-0 text-dark">Active Track Registries</h6>
            </div>

            {/* Table Scroll wrapper */}
            <div
              className="card-body p-0 bg-white"
              style={{ maxHeight: "465px", overflowY: "auto" }}
            >
              <div className="table-responsive">
                <table
                  className="table table-hover align-middle mb-0"
                  style={{ fontSize: "0.85rem" }}
                >
                  <thead
                    className="table-light text-uppercase"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <tr>
                      <th className="ps-3">Track Info</th>
                      <th>Album</th>
                      <th className="text-end pe-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!Array.isArray(songs) || songs.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted">
                          No song tracks discovered on this node endpoint
                          registry.
                        </td>
                      </tr>
                    ) : (
                      songs.map((item) => (
                        <tr
                          key={item._id}
                          // 🎯 VISUAL HINT: Dim hidden items slightly so Admin sees status clearly
                          style={{
                            opacity: item.visibility !== false ? 1 : 0.5,
                            transition: "opacity 0.2s",
                          }}
                        >
                          <td className="ps-3">
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={item.image || "https://placehold.co/40"}
                                alt=""
                                style={{
                                  width: "34px",
                                  height: "34px",
                                  borderRadius: "5px",
                                  objectFit: "cover",
                                }}
                              />
                              <div style={{ minWidth: 0 }}>
                                <p
                                  className="mb-0 fw-bold text-truncate"
                                  style={{ maxWidth: "180px" }}
                                >
                                  {item.songName || "Untitled Track"}
                                </p>
                                <small
                                  className="text-muted text-truncate d-block"
                                  style={{ maxWidth: "180px" }}
                                >
                                  {item.singer || "Unknown Artist"}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            {item.albumName || "Single"}
                            <div
                              className="small text-muted d-block"
                              style={{ fontSize: "0.65rem" }}
                            >
                              {item.visibility !== false
                                ? "🟢 Visible"
                                : "🛑 Hidden"}
                            </div>
                          </td>
                          <td className="text-end pe-3">
                            <div className="d-flex gap-1 justify-content-end">
                              {/* 🎯 NEW ACTION BUTTON: VISIBILITY TOGGLE INTEGRATION */}
                              <button
                                className={`btn btn-xs fw-semibold px-2 py-0.5 btn-sm ${item.visibility !== false ? "btn-outline-secondary" : "btn-success"}`}
                                style={{ fontSize: "0.7rem" }}
                                onClick={() => handleToggleVisibility(item._id)}
                              >
                                {item.visibility !== false
                                  ? "👁️ Hide"
                                  : "👁️ Show"}
                              </button>

                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => startEdit(item)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => deleteTrack(item._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageSongs;
