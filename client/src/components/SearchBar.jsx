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
        className="form-control form-control-lg"
        placeholder="🔍 Search Songs..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {suggestions.length > 0 && (

        <div
          className="list-group position-absolute w-100"
          style={{
            zIndex: 1000,
          }}
        >

          {suggestions.map(
            (song) => (

            <button
              key={song.trackId}
              className="list-group-item list-group-item-action"
              onClick={() =>
                selectSong(song)
              }
            >

              🎵 {song.trackName}

              <br />

              <small>
                {song.artistName}
              </small>

            </button>

          ))}

        </div>

      )}

    </div>
  );
}

export default SearchBar;