function SearchBar({
  search,
  setSearch,
  suggestions,
  selectSong,
}) {
  return (
    <div className="mb-3 position-relative">

      <input
        type="text"
        className="form-control form-control-lg shadow-sm"
        placeholder="🔍 Search by Song, Singer, Album or Music Director"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {suggestions.length > 0 && (
        <div
          className="list-group position-absolute w-100 shadow"
          style={{
            zIndex: 1000,
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((song) => (
            <button
              key={song.trackId}
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() =>
                selectSong(song)
              }
            >
              <div className="d-flex align-items-center">

                <img
                  src={song.artworkUrl60}
                  alt=""
                  className="rounded me-2"
                  width="40"
                />

                <div>

                  <strong>
                    {song.trackName}
                  </strong>

                  <br />

                  <small className="text-muted">
                    🎤 {song.artistName}
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