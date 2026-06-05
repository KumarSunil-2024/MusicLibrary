function SidebarSongs({
  songs,
  currentSong,
  playSong,
}) {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{
        height: "100vh",
        overflowY: "auto",
      }}
    >

      <h4 className="mb-3">
        🎵 Songs
      </h4>

      {songs.map(
        (song, index) => (

        <div
          key={song.trackId}
          onClick={() =>
            playSong(
              song,
              index
            )
          }
          className={`d-flex align-items-center p-2 rounded mb-2 ${
            currentSong?.trackId ===
            song.trackId
              ? "bg-primary"
              : "bg-secondary"
          }`}
          style={{
            cursor: "pointer",
          }}
        >

          <img
            src={song.artworkUrl60}
            alt=""
            width="50"
            className="rounded me-2"
          />

          <div>

            <strong>
              {song.trackName}
            </strong>

            <br />

            <small>
              {song.artistName}
            </small>

          </div>

        </div>

      ))}

    </div>
  );
}

export default SidebarSongs;