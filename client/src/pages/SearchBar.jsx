import React from "react";

function SearchBar({ search, setSearch, suggestions, selectSong }) {
  // Safe check to avoid rendering errors if suggestions is undefined
  const hasSuggestions = suggestions && suggestions.length > 0;

  return (
    <div className="mb-3 position-relative">
      
      {/* SEARCH INPUT FIELD */}
      <input
        type="text"
        className="form-control form-control-lg shadow-sm fs-6"
        placeholder="🔍 Search by Song, Singer, Album..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FLOATING SUGGESTIONS DROPDOWN PANEL */}
      {hasSuggestions && (
        <div
          className="list-group position-absolute w-100 shadow border-1"
          style={{
            zIndex: 1050, // Ensures overlay sits cleanly over all elements
            maxHeight: "260px",
            overflowY: "auto",
            top: "100%", // Anchors dropdown directly below the input
            left: 0
          }}
        >
          {suggestions.map((song, index) => (
            <button
              key={song.trackId || index} // Fallback index ensures unique rendering keys
              type="button"
              className="list-group-item list-group-item-action p-2"
              onClick={() => selectSong(song)}
            >
              <div className="d-flex align-items-center">
                
                {/* TRACK ARTWORK */}
                <img
                  src={song.artworkUrl60 || song.artworkUrl100 || "https://placehold.co/40"}
                  alt=""
                  className="rounded me-2 flex-shrink-0 object-fit-cover"
                  width="40"
                  height="40"
                />

                {/* TEXT METADATA BLOCK */}
                <div className="text-truncate text-start w-100 style-container" style={{ minWidth: 0 }}>
                  <p className="mb-0 fw-bold text-dark text-truncate" style={{ fontSize: "0.85rem" }}>
                    {song.trackName || "Untitled Track"}
                  </p>
                  <small className="text-muted text-truncate d-block" style={{ fontSize: "0.75rem" }}>
                    🎤 {song.artistName || "Unknown Artist"}
                  </small>
                </div>

              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;