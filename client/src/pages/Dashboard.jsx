import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 1. SAFE IDENTITY READ (Runs once on mount)
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        setUser(JSON.parse(userString));
      } catch (err) {
        console.error("Failed to read user data:", err);
      }
    }
  }, []);

  const isAdmin = user?.role === "ADMIN";

  // Reusable card structure for clean rendering
  const navigationCards = [
    {
      icon: "🎵",
      title: "Explore Music",
      desc: "Browse through the entire library, search your favorite tracks, and play live music previews.",
      link: "/songs",
      btnText: "Open Library",
      colorClass: "btn-primary"
    },
    {
      icon: "🎧",
      title: "My Playlists",
      desc: "Curate personal collections, manage soundtracks, and design custom playlists.",
      link: "/playlists",
      btnText: "View Playlists",
      colorClass: "btn-info text-white"
    },
    {
      icon: "👤",
      title: "Account Profile",
      desc: "Update security settings, personalize displays, and manage your account credentials.",
      link: "/profile",
      btnText: "Manage Profile",
      colorClass: "btn-success"
    }
  ];

  return (
    <div className="container py-4" style={{ color: "#2c3e50" }}>
      
      {/* 2. TOP BANNER WELCOME ROW - Fully Responsive */}
      <div 
        className="p-4 mb-4 border shadow-sm d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3" 
        style={{ backgroundColor: "#f8fafc", borderRadius: "12px" }}
      >
        <div>
          <small className="text-uppercase fw-bold text-muted" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
            Overview Dashboard
          </small>
          <h2 className="fw-bold text-dark m-0 mt-1">Hello, {user?.name || "Music Lover"}! 👋</h2>
        </div>
        <div>
          <span 
            className={`badge border px-3 py-2 fw-semibold ${
              isAdmin ? "bg-danger-subtle text-danger border-danger-subtle" : "bg-light text-secondary border"
            }`} 
            style={{ fontSize: "0.85rem" }}
          >
            {isAdmin ? "🛡️ Admin Account" : "👤 User Account"}
          </span>
        </div>
      </div>

      {/* 3. MAIN CARDS SYSTEM - Grid splits to columns on desktop */}
      <div className="row g-3">
        {navigationCards.map((card, idx) => (
          <div key={idx} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 border shadow-sm bg-white" style={{ borderRadius: "10px" }}>
              <div className="card-body p-3 d-flex flex-column justify-content-between">
                <div>
                  <div 
                    className="d-inline-flex align-items-center justify-content-center mb-2" 
                    style={{ width: "42px", height: "42px", borderRadius: "8px", backgroundColor: "#edf2f7", fontSize: "1.4rem" }}
                  >
                    {card.icon}
                  </div>
                  <h5 className="fw-bold text-dark mb-1">{card.title}</h5>
                  <p className="text-muted m-0" style={{ fontSize: "0.8rem", lineHeight: "1.4" }}>{card.desc}</p>
                </div>
                <Link to={card.link} className={`btn btn-sm ${card.colorClass} w-100 mt-3 fw-bold py-2`} style={{ borderRadius: "6px" }}>
                  {card.btnText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. CONDITIONAL ADMIN MANAGEMENT LAYOUT */}
      {isAdmin && (
        <div className="mt-4 pt-3 border-top">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span style={{ fontSize: "1.2rem" }}>🛠️</span>
            <h5 className="fw-bold m-0 text-danger">Administrative Console</h5>
          </div>
          
          <div className="row g-3">
            {/* Control Sub-Card 1 */}
            <div className="col-12 col-md-6">
              <div className="card border-0 p-3 text-white shadow-sm d-flex flex-column justify-content-between h-100" style={{ backgroundColor: "#1e293b", borderRadius: "10px" }}>
                <div>
                  <h6 className="fw-bold text-warning mb-1">Metrics & Controls</h6>
                  <p className="text-white-50 m-0 mb-3" style={{ fontSize: "0.78rem", lineHeight: "1.4" }}>
                    Review system metrics, monitor active client accounts, and adjust platform rules.
                  </p>
                </div>
                <Link to="/admin/dashboard" className="btn btn-sm btn-outline-warning fw-medium px-4 align-self-start" style={{ borderRadius: "6px" }}>
                  Launch Dashboard
                </Link>
              </div>
            </div>

            {/* Control Sub-Card 2 */}
            <div className="col-12 col-md-6">
              <div className="card border-0 p-3 text-white shadow-sm d-flex flex-column justify-content-between h-100" style={{ backgroundColor: "#1e293b", borderRadius: "10px" }}>
                <div>
                  <h6 className="fw-bold text-danger-subtle mb-1">Global Library Management</h6>
                  <p className="text-white-50 m-0 mb-3" style={{ fontSize: "0.78rem", lineHeight: "1.4" }}>
                    Directly inject fresh catalog items into the public database, edit fields, or remove tracks.
                  </p>
                </div>
                <Link to="/admin/songs" className="btn btn-sm btn-outline-danger fw-medium px-4 align-self-start" style={{ borderRadius: "6px" }}>
                  Modify Database
                </Link>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default Dashboard;