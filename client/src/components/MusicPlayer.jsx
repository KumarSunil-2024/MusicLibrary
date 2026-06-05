import { useState, useEffect, useRef } from "react";
// 💡 IMPORT YOUR CSS FILE HERE:
import "./MusicPlayer.css"; 

function MusicPlayer({ currentSong, nextSong, previousSong }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log("Playback error:", err));
      }
    }
  }, [currentSong]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.log("Playback error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSliderChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!currentSong) {
    return (
      <div className="card border-0 bg-light rounded-3 text-center py-2 shadow-sm">
        <p className="text-muted small mb-0 fw-medium">
          🎧 Select a track from the library queue above to unlock playback.
        </p>
      </div>
    );
  }

  return (
    <div className="premium-music-player card border-0 text-white p-2 shadow-lg">
      <audio
        ref={audioRef}
        src={currentSong.previewUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          nextSong();
        }}
      />

      <div className="row align-items-center g-2">
        
        {/* Left Section: Track Meta Details */}
        <div className="col-12 col-sm-4 d-flex align-items-center gap-2">
          <img
            src={currentSong.artworkUrl100}
            alt={currentSong.trackName}
            className={`img-fluid rounded-2 player-art ${isPlaying ? "art-spinning" : ""}`}
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
          <div className="text-truncate" style={{ maxWidth: "80%" }}>
            <h6 className="text-white mb-0 small fw-bold text-truncate">{currentSong.trackName}</h6>
            <span className="text-muted small-caption text-truncate d-block">{currentSong.artistName}</span>
          </div>
        </div>

        {/* Right Section: Core Media Controllers & Inline Horizontal Timeline */}
        <div className="col-12 col-sm-8 d-flex align-items-center justify-content-sm-end justify-content-center gap-3 flex-wrap flex-sm-nowrap">
          
          {/* Controls Button Cluster */}
          <div className="d-flex align-items-center gap-1">
            <button className="btn btn-player-action btn-sm" onClick={previousSong}>
              ⏮
            </button>
            <button className="btn btn-play-pause rounded-circle d-flex align-items-center justify-content-center" onClick={togglePlay}>
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button className="btn btn-player-action btn-sm" onClick={nextSong}>
              ⏭
            </button>
          </div>

          {/* Integrated Slider Timeline Wrapper */}
          <div className="timeline-container d-flex align-items-center gap-2 flex-grow-1 flex-sm-grow-0" style={{ minWidth: "180px", maxWidth: "320px" }}>
            <span className="timestamp text-muted">{formatTime(currentTime)}</span>
            <input
              type="range"
              className="form-range player-slider"
              min={0}
              max={duration || 30}
              step={0.1}
              value={currentTime}
              onChange={handleSliderChange}
            />
            <span className="timestamp text-muted">{formatTime(duration || 30)}</span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default MusicPlayer;