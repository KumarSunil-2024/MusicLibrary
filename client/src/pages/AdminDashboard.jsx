import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../style/AdminDashboard.css"; // SYNC EXTRACTED CSS

function AdminDashboard() {
  const navigate = useNavigate();

  // DASHBOARD REACT APP STATES
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [adminUser, setAdminUser] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [songSearch, setSongSearch] = useState("");

  // MEMOIZED FETCH: REGISTERED USERS API
  const fetchUsers = useCallback(async (signal) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      setUsers(res.data || []);
    } catch (err) {
      if (err.name !== "CanceledError") {
        console.error("Failed to load user accounts:", err.message);
      }
    }
  }, []);

  // MEMOIZED FETCH: GLOBAL TRACK LISTING
  const fetchSongs = useCallback(async (signal) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/songs/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const songData = res.data?.data || res.data || [];
      setSongs(songData);
    } catch (err) {
      if (err.name !== "CanceledError") {
        console.error("Failed to pull down track records:", err.message);
      }
    }
  }, []);

  // AUTHENTICATION, ROLE PROTECTION, AND INITIAL DATA DISPATCH
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
        return;
      }
      
      setAdminUser(parsedUser);
      
      // AbortController clean up handles unmounted components gracefully
      const controller = new AbortController();
      fetchUsers(controller.signal);
      fetchSongs(controller.signal);

      return () => controller.abort();
    } catch (err) {
      console.error("Authentication check failed:", err);
      navigate("/");
    }
  }, [navigate, fetchUsers, fetchSongs]);

  // UPDATE USER DATA NODE
  const updateUser = async (id) => {
    const newName = prompt("Enter New Name");
    if (!newName?.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const trimmedName = newName.trim();
      
      await api.put(
        `/admin/users/${id}`,
        { name: trimmedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("User updated successfully!");
      
      // Optimistic state update to avoid an extra network roundtrip fetch
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === id ? { ...u, name: trimmedName } : u))
      );
    } catch (err) {
      alert("Failed to update user profile.");
    }
  };

  // DELETE CHOSEN SYSTEM PROFILE
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user account permanently?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User removed from registry.");
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== id));
    } catch (err) {
      alert("Operation failed on server node.");
    }
  };

  // TOGGLE SONG WEB VISIBILITY
  const handleToggleVisibility = async (songId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.put(
        `/songs/${songId}/visibility`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSongs((prevSongs) =>
          prevSongs.map((track) =>
            track._id === songId
              ? { ...track, visibility: res.data.song.visibility }
              : track
          )
        );
      }
    } catch (err) {
      alert("Could not modify visibility matrix attributes.");
    }
  };

  // HIGH-PERFORMANCE FILTERS (Normalized search targets outside filter iterations)
  const filteredUsers = useMemo(() => {
    const term = userSearch.toLowerCase().trim();
    if (!term) return users;

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
    );
  }, [userSearch, users]);

  const filteredSongs = useMemo(() => {
    const term = songSearch.toLowerCase().trim();
    if (!term) return songs;

    return songs.filter(
      (song) =>
        song.songName?.toLowerCase().includes(term) ||
        song.singer?.toLowerCase().includes(term) ||
        song.albumName?.toLowerCase().includes(term)
    );
  }, [songSearch, songs]);

  // READ-ONLY COMPUTE PERFORMANCE (Derived cleanly from base states)
  const totalPublicSongs = useMemo(() => songs.filter(s => s.visibility !== false).length, [songs]);
  const totalHiddenSongs = useMemo(() => songs.length - totalPublicSongs, [songs, totalPublicSongs]);

  return (
    <div className="container py-4" style={{ color: "#1e293b", fontFamily: "sans-serif" }}>
      
      {/* APP OVERVIEW HERO BANNER */}
      <div className="p-4 mb-4 shadow-sm border-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 admin-hero-banner">
        <div>
          <h3 className="font-extrabold m-0 d-flex align-items-center gap-2" style={{ letterSpacing: "-0.5px" }}>
            <span>👑</span> Welcome back, Admin 👋
          </h3>
          <p className="m-0 mt-1 text-white-50" style={{ fontSize: "0.875rem" }}>
            Operational Session Authenticated As: <strong className="text-white">{adminUser?.name || "Root Admin"}</strong>
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/songs" className="btn btn-sm btn-light border-0 shadow-sm fw-bold px-4 py-2" style={{ borderRadius: "8px", color: "#1e1e38" }}>
          Admin Control Pannel
          </Link>
          <Link to="/songs" className="btn btn-sm btn-outline-light border-2 fw-bold px-4 py-2" style={{ borderRadius: "8px" }}>
            🎧 Client Deck
          </Link>
        </div>
      </div>

      {/* METRICS DISPATCH PANELS */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm p-3 bg-white admin-metric-card">
            <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.65rem", letterSpacing: "1px" }}>System Nodes</small>
            <h3 className="font-black m-0 text-primary">{users.length} <span style={{ fontSize: "1rem" }}>Profiles</span></h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm p-3 bg-white admin-metric-card">
            <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.65rem", letterSpacing: "1px" }}>Total Tracks</small>
            <h3 className="font-black m-0 text-success">{songs.length} <span style={{ fontSize: "1rem" }}>Indexed</span></h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm p-3 bg-white admin-metric-card">
            <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.65rem", letterSpacing: "1px" }}>Public View</small>
            <h3 className="font-black m-0 text-info">{totalPublicSongs} <span style={{ fontSize: "1rem" }}>Online</span></h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm p-3 bg-white admin-metric-card">
            <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: "0.65rem", letterSpacing: "1px" }}>Hidden View</small>
            <h3 className="font-black m-0 text-warning">{totalHiddenSongs} <span style={{ fontSize: "1rem" }}>Restricted</span></h3>
          </div>
        </div>
      </div>

      <div className="row g-4">
        
        {/* REGISTERED USER MATRIX CARD */}
        <div className="col-12 col-xl-5">
          <div className="card border-0 shadow-sm bg-white admin-board-card">
            <div className="px-3 py-3 border-bottom bg-light d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
              <h6 className="fw-bold m-0 text-dark d-flex align-items-center gap-2">
                <span>👥</span> User Profiles Node
              </h6>
              <div style={{ maxWidth: "200px", width: "100%" }}>
                <input
                  type="text"
                  className="form-control form-control-sm border shadow-sm px-3"
                  style={{ borderRadius: "8px", fontSize: "0.8rem" }}
                  placeholder="Quick lookup profiles..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="p-2 admin-scroll-box">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-5 text-muted small">No active system registries available.</div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {filteredUsers.map((u) => (
                    <div key={u._id} className="d-flex align-items-center justify-content-between p-2 border-0 admin-transition admin-item-hover admin-list-item">
                      <div className="d-flex flex-column" style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-bold text-dark admin-text-truncate" style={{ fontSize: "0.85rem", maxWidth: "160px" }}>{u.name}</span>
                          <span 
                            className="badge border-0" 
                            style={{ 
                              fontSize: "0.6rem", 
                              borderRadius: "4px",
                              backgroundColor: u.role === "ADMIN" ? "#fee2e2" : "#e0f2fe",
                              color: u.role === "ADMIN" ? "#ef4444" : "#0284c7"
                            }}
                          >
                            {u.role}
                          </span>
                        </div>
                        <span className="text-muted font-monospace admin-text-truncate" style={{ fontSize: "0.7rem" }}>{u.email}</span>
                      </div>
                      
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-white border shadow-sm px-2 py-1 text-warning fw-bold" style={{ fontSize: "0.7rem", borderRadius: "6px" }} onClick={() => updateUser(u._id)}>🔧</button>
                        <button className="btn btn-sm btn-white border shadow-sm px-2 py-1 text-danger fw-bold" style={{ fontSize: "0.7rem", borderRadius: "6px" }} onClick={() => deleteUser(u._id)}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SONG INVENTORY CONFIGURATION MATRIX */}
        <div className="col-12 col-xl-7">
          <div className="card border-0 shadow-sm bg-white admin-board-card">
            <div className="px-3 py-3 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center bg-light gap-2">
              <h6 className="fw-bold m-0 text-dark d-flex align-items-center gap-2">
                <span>🎵</span> Media Catalogue Layer
              </h6>
              <div style={{ maxWidth: "240px", width: "100%" }}>
                <input
                  type="text"
                  className="form-control form-control-sm border shadow-sm px-3"
                  style={{ borderRadius: "8px", fontSize: "0.8rem" }}
                  placeholder="Quick lookup tracks..."
                  value={songSearch}
                  onChange={(e) => setSongSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="p-2 admin-scroll-box">
              {filteredSongs.length === 0 ? (
                <div className="text-center py-5 text-muted small">No database catalog matches found.</div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {filteredSongs.map((song) => (
                    <div 
                      key={song._id} 
                      className="d-flex align-items-center justify-content-between p-2 border-0 admin-list-item"
                      style={{ 
                        opacity: song.visibility !== false ? 1 : 0.65, 
                        transition: "all 0.2s" 
                      }}
                    >
                      <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                        <div 
                          className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm" 
                          style={{ 
                            width: "36px", 
                            height: "36px", 
                            fontSize: "0.9rem",
                            background: song.visibility !== false ? "#10b981" : "#64748b"
                          }}
                        >
                          💿
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p className="m-0 fw-bold text-dark admin-text-truncate" style={{ fontSize: "0.85rem", maxWidth: "240px" }}>{song.songName}</p>
                          <small className="text-muted d-block admin-text-truncate" style={{ fontSize: "0.7rem" }}>Artist: {song.singer || "—"}</small>
                        </div>
                      </div>

                      <div>
                        <button
                          className={`btn btn-sm px-3 fw-bold shadow-sm admin-transition border-0 ${
                            song.visibility !== false ? "btn-light text-secondary" : "btn-dark text-success"
                          }`}
                          style={{ fontSize: "0.7rem", borderRadius: "6px", minWidth: "90px" }}
                          onClick={() => handleToggleVisibility(song._id)}
                        >
                          {song.visibility !== false ? "🔒 Hide" : "🔓 Publish"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;