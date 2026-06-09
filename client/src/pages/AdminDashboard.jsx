import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  // Read authentication credentials safely from local storage context
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const token = localStorage.getItem("token");

  // Reusable unified abstraction block for API actions
  const handleAdminAction = useCallback(
    async (method, url, payload = null) => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const args = payload ? [url, payload, config] : [url, config];
        const res = await api[method](...args);

        if (method === "get") setUsers(res.data);
        else handleAdminAction("get", "/admin/users"); // Auto-refresh user tables on CRUD mutation
      } catch (err) {
        console.error(
          `Admin core operation failure (${url}):`,
          err.response?.data?.message || err.message,
        );
      }
    },
    [token],
  );

  useEffect(() => {
    handleAdminAction("get", "/admin/users");
  }, [handleAdminAction]);

  const updateUser = (id) => {
    const name = prompt("Enter New Name");
    if (name?.trim()) handleAdminAction("put", `/admin/users/${id}`, { name });
  };

  const deleteUser = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user account permanently?",
      )
    ) {
      handleAdminAction("delete", `/admin/users/${id}`);
    }
  };

  return (
    <div className="container py-3" style={{ color: "#2c3e50" }}>
      {/* Overview Metadata Context Strip */}
      <div
        className="p-3 mb-3 border shadow-sm d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3"
        style={{ backgroundColor: "#f8fafc", borderRadius: "10px" }}
      >
        <div>
          <h4 className="fw-bold text-dark m-0">👑 Administrative Workspace</h4>
          <p className="text-muted m-0" style={{ fontSize: "0.8rem" }}>
            Welcome back, <strong>{user?.name || "Administrator"}</strong>.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link
            to="/admin/songs"
            className="btn btn-sm btn-primary fw-bold px-3"
            style={{ borderRadius: "6px" }}
          >
            Manage Database
          </Link>
          <Link
            to="/songs"
            className="btn btn-sm btn-outline-secondary fw-semibold px-3"
            style={{ borderRadius: "6px" }}
          >
            View Client Interface
          </Link>
        </div>
      </div>

      {/* Main Core Users Data Feed Window */}
      <div
        className="card border shadow-sm"
        style={{ borderRadius: "10px", overflow: "hidden" }}
      >
        <div
          className="px-3 py-2 border-bottom d-flex justify-content-between align-items-center"
          style={{ backgroundColor: "#edf2f7" }}
        >
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
              No alternative active system records discovered on this node.
            </div>
          ) : (
            <div className="d-flex flex-column gap-1">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center p-2 rounded border-bottom gap-2"
                  style={{ transition: "background 0.2s" }}
                >
                  {/* Account Information Stack */}
                  <div className="d-flex flex-column gap-0.5 text-center text-sm-start">
                    <div className="d-flex align-items-center justify-content-center justify-content-sm-start gap-2">
                      <p
                        className="mb-0 fw-bold text-dark"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {u.name}
                      </p>
                      <span
                        className={`badge px-2 py-0.5 border fw-medium`}
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
                      className="text-muted d-block"
                      style={{ fontSize: "0.75rem" }}
                    >
                      📧 {u.email} {u.phone && `| 📱 ${u.phone}`}
                    </small>
                  </div>

                  {/* Actions Toolbar Alignment */}
                  <div className="d-flex gap-1 justify-content-center align-self-center align-self-sm-auto">
                    <button
                      className="btn btn-sm px-2.5 py-0.5 btn-outline-warning fw-semibold"
                      style={{ fontSize: "0.75rem", borderRadius: "4px" }}
                      onClick={() => updateUser(u._id)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-sm px-2.5 py-0.5 btn-danger fw-medium"
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
    </div>
  );
}

export default AdminDashboard;
