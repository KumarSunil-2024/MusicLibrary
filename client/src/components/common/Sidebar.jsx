import { Link } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div
      className="bg-light border-end"
      style={{
        width: "250px",
        minHeight: "100vh",
      }}
    >
      <div className="p-3">
        <h4>Menu</h4>

        <ul className="list-group">
          <Link className="list-group-item" to="/dashboard">
            Dashboard
          </Link>

          <Link className="list-group-item" to="/dashboard/songs">
            Songs
          </Link>

          <Link className="list-group-item" to="/dashboard/playlists">
            Playlists
          </Link>

          <Link className="list-group-item" to="/profile">
            Profile
          </Link>

          {user?.role === "ADMIN" && (
            <Link className="list-group-item" to="/admin">
              Admin Panel
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
