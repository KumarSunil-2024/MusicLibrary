import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [adminUser, setAdminUser] = useState(null);

  // 1. SECURE INITIALIZATION & ROLE PROTECTION
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      navigate("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(userString);
      if (parsedUser?.role !== "ADMIN") {
        navigate("/dashboard");
      } else {
        setAdminUser(parsedUser);
        fetchUsers();
        fetchSongs(); // 🎯 Initiates collection pull
      }
    } catch (err) {
      console.error("Authentication check failed:", err);
      navigate("/");
    }
  }, [navigate]);

  // 2. EXPLICIT USER ACCOUNTS API METHODS
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load user accounts:", err.message);
    }
  };

  const updateUser = async (id) => {
    const newName = prompt("Enter New Name");
    if (!newName?.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/admin/users/${id}`,
        { name: newName.trim() },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert("User updated successfully!");
      fetchUsers();
    } catch (err) {
      alert("Failed to update user profile.");
    }
  };

  const deleteUser = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user account permanently?",
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User removed from registry.");
      fetchUsers();
    } catch (err) {
      alert("Operation failed on server node.");
    }
  };

  // 3. 🎯 THE SONG VISIBILITY FETCH CORRECTION
  const fetchSongs = async () => {
    try {
      const token = localStorage.getItem("token");

      // 🎯 FIX: Changed endpoint to match your explicit admin router definition mapping!
      // This path returns ALL songs (both visible and hidden) so the admin can manage them.
      const res = await api.get("/songs/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Safely handle both array payload structural layouts
      const songData = res.data?.data || res.data || [];
      setSongs(songData);
    } catch (err) {
      console.error("Failed to pull down track records:", err.message);
    }
  };

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
        // Map updates straight into local React state references array indices
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

  return (
    <div className="container py-3" style={{ color: "#2c3e50" }}>
      {/* OVERVIEW CONTEXT BANNER */}
      <div
        className="p-3 mb-3 border shadow-sm d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3"
        style={{ backgroundColor: "#f8fafc", borderRadius: "10px" }}
      >
        <div>
          <h4 className="fw-bold text-dark m-0">👑 Administrative Workspace</h4>
          <p className="text-muted m-0" style={{ fontSize: "0.8rem" }}>
            Welcome back, <strong>{adminUser?.name || "Administrator"}</strong>.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link
            to="/admin/songs"
            className="btn btn-sm btn-primary fw-bold px-3"
          >
            Manage Database
          </Link>
          <Link
            to="/songs"
            className="btn btn-sm btn-outline-secondary fw-semibold px-3"
          >
            View Client Interface
          </Link>
        </div>
      </div>

      {/* REGISTRY CARD MAIN WINDOW */}
      <div
        className="card border shadow-sm mb-4"
        style={{ borderRadius: "10px", overflow: "hidden" }}
      >
        <div className="px-3 py-2 border-bottom d-flex justify-content-between align-items-center bg-light">
          <h6 className="fw-bold m-0 text-dark">Registered System Accounts</h6>
          <span
            className="badge bg-primary rounded-pill fw-medium"
            style={{ fontSize: "0.75rem" }}
          >
            {users.length} Active Profiles
          </span>
        </div>

        <div className="card-body p-2 bg-white">
          {users.length === 0 ? (
            <div
              className="text-center py-4 text-muted"
              style={{ fontSize: "0.85rem" }}
            >
              No active system records discovered on this node.
            </div>
          ) : (
            <div className="d-flex flex-column gap-1">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center p-2 rounded border-bottom gap-3"
                >
                  <div
                    className="d-flex flex-column text-center text-sm-start"
                    style={{ minWidth: 0 }}
                  >
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-sm-start gap-2">
                      <p
                        className="mb-0 fw-bold text-dark text-truncate"
                        style={{ fontSize: "0.9rem", maxWidth: "200px" }}
                      >
                        {u.name}
                      </p>
                      <span
                        className="badge px-2 py-0.5 border fw-medium"
                        style={{
                          fontSize: "0.65rem",
                          backgroundColor:
                            u.role === "ADMIN" ? "#fee2e2" : "#f1f5f9",
                          color: u.role === "ADMIN" ? "#ef4444" : "#4b5563",
                          borderColor:
                            u.role === "ADMIN" ? "#fca5a5" : "#e2e8f0",
                        }}
                      >
                        {u.role}
                      </span>
                    </div>
                    <small
                      className="text-muted d-block text-truncate"
                      style={{ fontSize: "0.75rem" }}
                    >
                      📧 {u.email} {u.phone && `| 📱 ${u.phone}`}
                    </small>
                  </div>

                  <div className="d-flex gap-2 justify-content-center flex-shrink-0">
                    <button
                      className="btn btn-sm btn-outline-warning fw-semibold px-3 py-1"
                      style={{ fontSize: "0.75rem", borderRadius: "4px" }}
                      onClick={() => updateUser(u._id)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-sm btn-danger fw-medium px-3 py-1"
                      style={{ fontSize: "0.75rem", borderRadius: "4px" }}
                      onClick={() => deleteUser(u._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TRACK CATALOG VISIBILITY MATRIX */}
      <div
        className="card border shadow-sm"
        style={{ borderRadius: "10px", overflow: "hidden" }}
      >
        <div className="px-3 py-2 border-bottom d-flex justify-content-between align-items-center bg-light">
          <h6 className="fw-bold m-0 text-dark">
            Track Catalog Visibility Matrix
          </h6>
          <span
            className="badge bg-success rounded-pill fw-medium"
            style={{ fontSize: "0.75rem" }}
          >
            {songs.length} Tracks Indexed
          </span>
        </div>

        <div className="card-body p-2 bg-white">
          {songs.length === 0 ? (
            <div
              className="text-center py-4 text-muted"
              style={{ fontSize: "0.85rem" }}
            >
              No song tracks uploaded into database tables yet.
            </div>
          ) : (
            <div className="d-flex flex-column gap-1">
              {songs.map((song) => (
                <div
                  key={song._id}
                  className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center p-2 rounded border-bottom gap-3"
                  style={{
                    opacity: song.visibility !== false ? 1 : 0.5,
                    transition: "opacity 0.2s",
                  }}
                >
                  <div className="d-flex flex-column text-center text-sm-start">
                    <div className="d-flex align-items-center justify-content-center justify-content-sm-start gap-2">
                      <p
                        className="mb-0 fw-bold text-dark text-truncate"
                        style={{ fontSize: "0.9rem", maxWidth: "250px" }}
                      >
                        🎵 {song.songName}
                      </p>
                      <span
                        className={`badge px-2 py-0.5 border text-uppercase style={{ fontSize: "0.6rem" }} ${
                          song.visibility !== false
                            ? "bg-light text-success border-success"
                            : "bg-light text-secondary border-secondary"
                        }`}
                      >
                        {song.visibility !== false ? "Public" : "Hidden"}
                      </span>
                    </div>
                    <small
                      className="text-muted d-block"
                      style={{ fontSize: "0.75rem" }}
                    >
                      🎤 Singer: {song.singer} | 💿 Album: {song.albumName}
                    </small>
                  </div>

                  <div className="d-flex gap-2 justify-content-center flex-shrink-0">
                    <button
                      className={`btn btn-sm fw-semibold px-3 py-1 ${
                        song.visibility !== false
                          ? "btn-outline-secondary"
                          : "btn-success"
                      }`}
                      style={{
                        fontSize: "0.75rem",
                        borderRadius: "4px",
                        minWidth: "100px",
                      }}
                      onClick={() => handleToggleVisibility(song._id)}
                    >
                      {song.visibility !== false
                        ? "👁️ Hide Song"
                        : "👁️‍🗨️ Show Song"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
