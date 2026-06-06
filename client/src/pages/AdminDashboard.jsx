import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUser = async (id) => {
    const name = prompt("Enter New Name");

    if (!name) return;

    try {
      await api.put(
        `/admin/users/${id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">

      <div className="card shadow border-0 mb-4">
        <div className="card-body">

          <h2 className="mb-3">
            👑 Admin Dashboard
          </h2>

          <p>
            Welcome,
            <strong> {user?.name}</strong>
          </p>

          <div className="d-flex gap-2">
            <Link
              to="/admin/songs"
              className="btn btn-primary"
            >
              Manage Songs
            </Link>

            <Link
              to="/songs"
              className="btn btn-success"
            >
              View Songs
            </Link>
          </div>

        </div>
      </div>

      <div className="card shadow border-0">
        <div className="card-body">

          <h4 className="mb-3">
            Users ({users.length})
          </h4>

          {users.length === 0 ? (
            <div className="alert alert-info">
              No Users Found
            </div>
          ) : (
            users.map((u) => (
              <div
                key={u._id}
                className="border rounded p-3 mb-3"
              >
                <div className="row">

                  <div className="col-md-8">

                    <h5>{u.name}</h5>

                    <p className="mb-1">
                      📧 {u.email}
                    </p>

                    <p className="mb-1">
                      📱 {u.phone}
                    </p>

                    <span className="badge bg-secondary">
                      {u.role}
                    </span>

                  </div>

                  <div className="col-md-4 text-end">

                    <button
                      className="btn btn-warning me-2"
                      onClick={() =>
                        updateUser(u._id)
                      }
                    >
                      Update
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        deleteUser(u._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            ))
          )}

        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;