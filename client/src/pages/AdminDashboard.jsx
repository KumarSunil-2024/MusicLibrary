import { Link } from "react-router-dom";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h2>Admin Dashboard</h2>

        <p>
          Welcome,
          <strong> {user?.name}</strong>
        </p>

        <div className="d-flex gap-2 mt-3">
          <Link to="/admin/songs" className="btn btn-primary">
            Manage Songs
          </Link>

          <Link to="/songs" className="btn btn-success">
            View Songs
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
