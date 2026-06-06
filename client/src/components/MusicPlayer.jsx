import { useRef, useState } from "react";

function MusicPlayer({
  currentSong,
  songs,
  currentIndex,
  nextSong,
  previousSong,
}) {
  const audioRef = useRef(null);

  const [repeat, setRepeat] =
    useState(false);

  const [shuffle, setShuffle] =
    useState(false);

  if (!currentSong) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center">
          <h5>
            🎵 Select A Song
          </h5>
        </div>
      </div>
    );
  }

  const handleEnded = () => {
    if (repeat) {
      audioRef.current.currentTime = 0;

      audioRef.current.play();

      return;
    }

    if (shuffle) {
      const random =
        Math.floor(
          Math.random() *
            songs.length
        );

      window.location.reload();

      return;
    }

    nextSong();
  };

  return (
    <div className="card shadow-sm mt-3">
      <div className="card-body">

        <div className="row align-items-center">

          <div className="col-md-2">

            <img
              src={
                currentSong.artworkUrl100
              }
              alt=""
              className="img-fluid rounded"
            />

          </div>

          <div className="col-md-4">

            <h5>
              {
                currentSong.trackName
              }
            </h5>

            <p className="text-muted">
              {
                currentSong.artistName
              }
            </p>

          </div>

          <div className="col-md-6">

            <audio
              ref={audioRef}
              key={
                currentSong.trackId
              }
              controls
              autoPlay
              className="w-100"
              onEnded={
                handleEnded
              }
            >
              <source
                src={
                  currentSong.previewUrl
                }
                type="audio/mpeg"
              />
            </audio>

            <div className="mt-3 d-flex gap-2">

              <button
                className="btn btn-outline-secondary"
                onClick={
                  previousSong
                }
              >
                ⏮ Prev
              </button>

              <button
                className="btn btn-success"
                onClick={
                  nextSong
                }
              >
                ⏭ Next
              </button>

              <button
                className={`btn ${
                  repeat
                    ? "btn-warning"
                    : "btn-outline-warning"
                }`}
                onClick={() =>
                  setRepeat(
                    !repeat
                  )
                }
              >
                🔁 Repeat
              </button>

              <button
                className={`btn ${
                  shuffle
                    ? "btn-info"
                    : "btn-outline-info"
                }`}
                onClick={() =>
                  setShuffle(
                    !shuffle
                  )
                }
              >
                🔀 Shuffle
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default MusicPlayer;