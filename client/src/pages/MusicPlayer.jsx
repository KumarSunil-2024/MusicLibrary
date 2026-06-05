import { useRef, useState } from "react";

function MusicPlayer({
  currentSong,
  nextSong,
  previousSong,
  songs,
  currentIndex,
}) {
  const audioRef = useRef(null);

  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  if (!currentSong) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center">
          <h4>🎵 Music Player</h4>
          <p className="text-muted">Select a song from sidebar</p>
        </div>
      </div>
    );
  }

  const stopSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleSongEnd = () => {
    if (repeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    nextSong();
  };

  const shuffleSong = () => {
    if (songs.length === 0) return;

    const random = Math.floor(Math.random() * songs.length);

    window.location.href = "#";
  };

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="text-center">
          <img
            src={currentSong.artworkUrl100}
            alt=""
            width="150"
            className="rounded mb-3"
          />

          <h4>{currentSong.trackName}</h4>

          <p className="text-muted">{currentSong.artistName}</p>
        </div>

        <audio
          ref={audioRef}
          key={currentSong.trackId}
          controls
          className="w-100"
          onEnded={handleSongEnd}
        >
          <source src={currentSong.previewUrl} type="audio/mpeg" />
        </audio>

        <div className="d-flex justify-content-center gap-2 mt-3">
          <button className="btn btn-secondary" onClick={previousSong}>
            ⏮ Prev
          </button>

          <button className="btn btn-danger" onClick={stopSong}>
            ⏹ Stop
          </button>

          <button
            className={`btn ${repeat ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setRepeat(!repeat)}
          >
            🔁 Repeat
          </button>

          <button
            className={`btn ${shuffle ? "btn-info" : "btn-outline-info"}`}
            onClick={() => setShuffle(!shuffle)}
          >
            🔀 Shuffle
          </button>

          <button className="btn btn-success" onClick={nextSong}>
            Next ⏭
          </button>
        </div>

        <hr />

        <h6>Up Next</h6>

        {songs.slice(currentIndex + 1, currentIndex + 4).map((song) => (
          <div key={song.trackId} className="d-flex align-items-center mb-2">
            <img
              src={song.artworkUrl60}
              width="40"
              className="rounded me-2"
              alt=""
            />

            <div>
              <small>{song.trackName}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MusicPlayer;
