import { Link } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="container mt-5">
      {/* Dynamic Welcoming Header Section */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <span className="text-uppercase tracking-wider text-muted small fw-bold">Overview</span>
          <h1 className="fw-black display-5 mt-1">Hello, {user?.name || "Music Lover"}! 👋</h1>
        </div>
        <div className="col-auto">
          <span className={`badge rounded-pill px-3 py-2 fs-6 ${user?.role === "ADMIN" ? "bg-danger text-white" : "bg-dark text-light"}`}>
            <i className={`bi ${user?.role === "ADMIN" ? "bi-shield-check" : "bi-person"} me-2`}></i>
            {user?.role || "USER"} Account
          </span>
        </div>
      </div>

      {/* Main Navigation Visual Grid */}
      <div className="row g-4">
        {/* Card 1: View Songs */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card h-100 border-0 shadow-sm hover-translate transition p-2">
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <div className="icon-square bg-primary-subtle text-primary rounded-3 p-3 d-inline-flex mb-3">
                  <span className="fs-3">🎵</span>
                </div>
                <h4 className="card-title fw-bold">Explore Music</h4>
                <p className="card-text text-muted small">Browse through the entire library, search your favorite tracks, and play music previews instantly.</p>
              </div>
              <Link to="/songs" className="btn btn-primary w-100 mt-3 fw-semibold">
                Open Library
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2: My Playlists */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card h-100 border-0 shadow-sm hover-translate transition p-2">
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <div className="icon-square bg-info-subtle text-info rounded-3 p-3 d-inline-flex mb-3">
                  <span className="fs-3">🎧</span>
                </div>
                <h4 className="card-title fw-bold">My Playlists</h4>
                <p className="card-text text-muted small">Manage your personal collection. Curate custom soundscapes, edit tracks, or remove outdated selections.</p>
              </div>
              <Link to="/playlists" className="btn btn-info text-white w-100 mt-3 fw-semibold">
                View Playlists
              </Link>
            </div>
          </div>
        </div>

        {/* Card 3: User Profile */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card h-100 border-0 shadow-sm hover-translate transition p-2">
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <div className="icon-square bg-success-subtle text-success rounded-3 p-3 d-inline-flex mb-3">
                  <span className="fs-3">👤</span>
                </div>
                <h4 className="card-title fw-bold">Account Profile</h4>
                <p className="card-text text-muted small">Update your security settings, modify profile displays, and manage your account credentials safely.</p>
              </div>
              <Link to="/profile" className="btn btn-success w-100 mt-3 fw-semibold">
                Manage Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Conditionally Rendered Administrative Panel */}
      {user?.role === "ADMIN" && (
        <div className="mt-5 pt-4 border-top">
          <div className="d-flex align-items-center mb-4">
            <span className="fs-4 me-2">🛠️</span>
            <h3 className="fw-bold mb-0 text-danger">Administrative Console</h3>
          </div>
          
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="card border-0 bg-dark text-white p-3 shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold text-warning mb-2">Metrics & Controls</h5>
                  <p className="text-muted small">Review holistic system metrics, monitor active accounts, and manage core system structural adjustments.</p>
                  <Link to="/admin/dashboard" className="btn btn-outline-warning btn-sm mt-2 px-4">
                    Launch Admin Board
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="card border-0 bg-dark text-white p-3 shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold text-danger mb-2">Global Library Management</h5>
                  <p className="text-muted small">Directly upload new media catalogs to the public database, update outdated file paths, or clean up broken songs.</p>
                  <Link to="/admin/songs" className="btn btn-outline-danger btn-sm mt-2 px-4">
                    Modify Song Database
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;