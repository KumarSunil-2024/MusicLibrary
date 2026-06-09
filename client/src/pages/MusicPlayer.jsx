import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Square } from "lucide-react";

function MusicPlayer({ currentSong, nextSong, previousSong }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [modes, setModes] = useState({ repeat: false, shuffle: false });

  // 1. AUTO-PLAY CONTROLLER (Runs when song changes)
  useEffect(() => {
    const player = audioRef.current;
    if (player && currentSong?.previewUrl) {
      player.load();
      player.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Playback delayed:", err.message));
    } else {
      setIsPlaying(false);
    }
  }, [currentSong]);

  // 2. AUDIO HANDLERS (Straightforward & simple to explain)
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log(e));
    }
    setIsPlaying(!isPlaying);
  };

  const stopSong = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration || 0);
  };

  const handleSeek = (e) => {
    const val = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
    setCurrentTime(val);
  };

  const handleSongEnd = () => {
    if (modes.repeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log(e));
    } else {
      nextSong();
    }
  };

  // Helper function to turn seconds into MM:SS format
  const formatTime = (time) => {
    if (isNaN(time) || time === null) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Empty state guard
  if (!currentSong) {
    return (
      <div className="card text-center border p-3 shadow-sm bg-white" style={{ borderRadius: "10px" }}>
        <h6 className="fw-bold text-muted m-0">No Track Selected</h6>
      </div>
    );
  }

  return (
    <div className="card border shadow-sm mt-auto bg-white" style={{ borderRadius: "12px" }}>
      {/* HTML5 Native Audio element wrapper */}
      <audio
        ref={audioRef}
        src={currentSong.previewUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleSongEnd}
      />

      <div className="card-body p-3">
        {/* Responsive layout: row on desktop, column on phone */}
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          
          {/* TRACK IDENTITY BLOCK */}
          <div className="d-flex align-items-center gap-2 w-100 w-md-auto justify-content-center justify-content-md-start" style={{ minWidth: "200px" }}>
            <img
              src={currentSong.artworkUrl100 || "https://placehold.co/46"}
              alt="Art"
              style={{ width: "46px", height: "46px", borderRadius: "6px", objectFit: "cover" }}
            />
            <div style={{ maxWidth: "150px", overflow: "hidden" }}>
              <p className="mb-0 fw-bold text-dark text-truncate text-start" style={{ fontSize: "0.85rem" }}>
                {currentSong.trackName || "Unknown Track"}
              </p>
              <small className="text-muted text-truncate d-block text-start" style={{ fontSize: "0.75rem" }}>
                {currentSong.artistName || "Unknown Artist"}
              </small>
            </div>
          </div>

          {/* PLAYER CORE SYSTEM CONTROLS */}
          <div className="d-flex flex-column align-items-center gap-1 flex-grow-1 w-100" style={{ maxWidth: "440px" }}>
            
            {/* Control Toggles */}
            <div className="d-flex align-items-center gap-3 mb-1">
              <button className="btn btn-link p-1 border-0 bg-transparent" style={{ color: modes.shuffle ? "#10b981" : "#9ca3af" }} onClick={() => setModes(p => ({ ...p, shuffle: !p.shuffle }))}>
                <Shuffle size={16} />
              </button>
              
              <button className="btn btn-link p-1 border-0 bg-transparent text-secondary" onClick={previousSong}>
                <SkipBack size={18} />
              </button>
              
              <button className="btn d-flex align-items-center justify-content-center shadow-sm border-0" style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#1e3a8a", color: "#ffffff" }} onClick={togglePlay}>
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ms-0.5" />}
              </button>
              
              <button className="btn btn-link p-1 border-0 bg-transparent text-secondary" onClick={nextSong}>
                <SkipForward size={18} />
              </button>
              
              <button className="btn btn-link p-1 border-0 bg-transparent" style={{ color: modes.repeat ? "#10b981" : "#9ca3af" }} onClick={() => setModes(p => ({ ...p, repeat: !p.repeat }))}>
                <Repeat size={16} />
              </button>
              
              <button className="btn btn-link p-1 border-0 bg-transparent text-danger" onClick={stopSong}>
                <Square size={14} />
              </button>
            </div>

            {/* Slider Range Slider Timeline Container */}
            <div className="d-flex align-items-center gap-2 w-100">
              <span className="text-muted" style={{ fontSize: "0.7rem", minWidth: "30px", textAlign: "right" }}>
                {formatTime(currentTime)}
              </span>
              <input 
                type="range" 
                className="form-range flex-grow-1" 
                min="0" 
                max={duration} 
                value={currentTime} 
                onChange={handleSeek} 
                style={{ height: "4px", cursor: "pointer", accentColor: "#1e3a8a" }} 
              />
              <span className="text-muted" style={{ fontSize: "0.7rem", minWidth: "30px" }}>
                {formatTime(duration)}
              </span>
            </div>

          </div>

          {/* STREAM QUALITY BADGE */}
          <div className="d-none d-md-flex align-items-center gap-2 text-secondary" style={{ width: "120px", justifyContent: "flex-end" }}>
            <span className="badge bg-light text-secondary border fw-medium" style={{ fontSize: "0.6rem" }}>HQ STREAM</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;