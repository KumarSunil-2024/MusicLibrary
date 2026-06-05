import React from "react";

function SidebarSongs({ songs, currentSong, playSong }) {
  return (
    <div className="sidebar-songs-wrapper d-flex flex-column gap-1">
      {songs.map((song, index) => {
        const isActive = currentSong?.trackId === song.trackId;
        
        return (
          <div
            key={song.trackId}
            onClick={() => playSong(song, index)}
            className={`d-flex align-items-center p-2 rounded-3 transition-all premium-track-item ${
              isActive ? "active-track" : ""
            }`}
            style={{ cursor: "pointer" }}
          >
            {/* Artwork Thumbnail Container */}
            <div className="position-relative flex-shrink-0 me-2">
              <img
                src={song.artworkUrl60 || song.artworkUrl100}
                alt={song.trackName}
                width="44"
                height="44"
                className="rounded-2 shadow-sm object-fit-cover"
              />
              {isActive && (
                <div className="active-overlay rounded-2 d-flex align-items-center justify-content-center">
                  <span className="small">🔊</span>
                </div>
              )}
            </div>

            {/* Core Text Info Block */}
            <div className="w-100 min-w-0 text-truncate">
              <div 
                className={`fw-semibold text-truncate small mb-0 ${
                  isActive ? "text-success-accent" : "text-light-main"
                }`}
                style={{ fontSize: "0.825rem" }}
              >
                {song.trackName}
              </div>
              <div 
                className="text-muted text-truncate" 
                style={{ fontSize: "0.725rem", marginTop: "1px" }}
              >
                {song.artistName}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default SidebarSongs;