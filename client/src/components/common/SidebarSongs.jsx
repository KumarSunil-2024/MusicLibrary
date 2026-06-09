import React from "react";

function SidebarSongs({ songs, currentSong, playSong }) {
  // If there are no songs, return a clean empty state message
  if (!songs || songs.length === 0) {
    return (
      <div className="text-center text-muted p-3" style={{ fontSize: "0.85rem" }}>
        No songs available.
      </div>
    );
  }

  return (
    <div className="sidebar-songs-wrapper d-flex flex-column gap-1">
      {songs.map((song, index) => {
        // Simple track match check
        const isActive = currentSong?.trackId === song.trackId;
        
        return (
          <div
            key={song.trackId || index}
            onClick={() => playSong(song, index)}
            className={`d-flex align-items-center p-2 rounded-3 ${
              isActive ? "bg-light border-start border-4 border-success" : ""
            }`}
            style={{ cursor: "pointer", minWidth: 0 }}
          >
            {/* 1. IMAGE CONTAINER */}
            <div className="position-relative flex-shrink-0 me-2">
              <img
                src={song.artworkUrl60 || song.artworkUrl100}
                alt=""
                width="40"
                height="40"
                className="rounded-2 object-fit-cover"
              />
              {isActive && (
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100 rounded-2 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                >
                  <span style={{ fontSize: "0.75rem" }}>🔊</span>
                </div>
              )}
            </div>

            {/* 2. TEXT INFO (Fully Responsive & Overflow Guarded) */}
            <div className="flex-grow-1 min-w-0">
              <p 
                className={`fw-semibold text-truncate mb-0 ${isActive ? "text-success" : ""}`}
                style={{ fontSize: "0.8rem", lineHeight: "1.2" }}
              >
                {song.trackName}
              </p>
              <p 
                className="text-muted text-truncate mb-0" 
                style={{ fontSize: "0.7rem", marginTop: "2px" }}
              >
                {song.artistName}
              </p>
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default SidebarSongs;