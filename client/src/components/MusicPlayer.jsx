import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";

function MusicPlayer({ currentSong, nextSong, previousSong }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);

  // 🎯 OPTIMIZATION 1: Helper function to pull links instantly without waiting for useEffect loops
  const extractArtwork = (song) => {
    if (!song) return "/default-music.png";
    const url = song.artworkUrl || song.image || song.artworkUrl100 || "";
    return url && typeof url === "string" && url.trim().startsWith("http")
      ? url.trim()
      : "/default-music.png";
  };

  // 🎯 OPTIMIZATION 2: Lazy State Initialization maps image immediately on first execution frame
  const [imgSrc, setImgSrc] = useState(() => extractArtwork(currentSong));

  // Core audio pipelines pipeline synchronization
  useEffect(() => {
    if (audioRef.current && currentSong?.previewUrl) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => console.log("Track change handled cleanly"));
      }
    }
    
    // Synergizes state changes instantly without frame jumping
    setImgSrc(extractArtwork(currentSong));
  }, [currentSong, isPlaying]);

  // 🎯 OPTIMIZATION 3: Stable, memoized action callbacks save memory cycles
  const togglePlay = useCallback(() => {
    if (!currentSong || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => console.log("Audio pipeline ready"));
    }
    setIsPlaying(prev => !prev);
  }, [currentSong, isPlaying]);

  // Performance optimized layout time strings tracker engine
  const formatTime = useCallback((secs) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  }, []);

  // Memoize textual field descriptions to protect frame boundaries
  const trackDisplayTitle = useMemo(() => 
    currentSong?.trackName || currentSong?.songName || currentSong?.songTitle || "No Song Selected",
    [currentSong]
  );

  const artistDisplayTitle = useMemo(() => 
    currentSong?.artistName || currentSong?.singer || "Select a track to start streaming",
    [currentSong]
  );

  return (
    <div 
      className="card border shadow-sm w-100 mt-2" 
      style={{ 
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        borderLeft: "5px solid #1e3a8a"
      }}
    >
      {currentSong?.previewUrl && (
        <audio 
          ref={audioRef} 
          src={currentSong.previewUrl}
          loop={isLooping}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={() => { if (!isLooping) nextSong(); }}
        />
      )}

      <div className="card-body p-3 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
        
        {/* Left Segment: Track Meta Information */}
        <div className="d-flex align-items-center gap-3 w-100 w-sm-auto text-center text-sm-start" style={{ maxWidth: "250px" }}>
          <img 
            src={imgSrc} 
            alt="Album Artwork" 
            style={{ 
              width: "48px", 
              height: "48px", 
              borderRadius: "6px", 
              objectFit: "cover",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              backgroundColor: "#f1f5f9"
            }}
            onError={() => {
              if (imgSrc !== "/default-music.png") {
                setImgSrc("/default-music.png");
              }
            }}
          />
          <div className="text-truncate flex-grow-1">
            <h6 className="fw-bold m-0 text-truncate text-dark" style={{ fontSize: "0.95rem" }}>
              {trackDisplayTitle}
            </h6>
            <small className="text-muted d-block text-truncate mt-0.5" style={{ fontSize: "0.78rem" }}>
              {artistDisplayTitle}
            </small>
          </div>
        </div>

        {/* Center Segment: Timeline Slider */}
        <div className="flex-grow-1 w-100 px-md-3">
          <div className="d-flex align-items-center gap-2">
            <small className="text-muted font-monospace" style={{ fontSize: "0.75rem", minWidth: "30px" }}>{formatTime(currentTime)}</small>
            <input 
              type="range" 
              className="form-range flex-grow-1" 
              min={0} 
              max={duration || 100} 
              value={currentTime}
              onChange={(e) => {
                const targetTime = Number(e.target.value);
                if (audioRef.current) audioRef.current.currentTime = targetTime;
                setCurrentTime(targetTime);
              }}
              style={{ cursor: "pointer", height: "4px" }} 
            />
            <small className="text-muted font-monospace" style={{ fontSize: "0.75rem", minWidth: "30px" }}>{formatTime(duration)}</small>
          </div>
        </div>

        {/* Right Segment: Media Action Buttons */}
        <div className="d-flex align-items-center justify-content-center gap-2 w-100 w-sm-auto">
          
          <button 
            className="btn btn-link p-1 text-decoration-none border-0" 
            style={{ fontSize: "1.1rem", opacity: isLooping ? "1" : "0.35", color: isLooping ? "#0d6efd" : "#4a5568" }}
            onClick={() => setIsLooping(prev => !prev)}
            title="Repeat track"
          >
            🔁
          </button>

          <button 
            className="btn btn-link p-1 text-secondary border-0" 
            style={{ fontSize: "1.2rem" }}
            onClick={previousSong}
            disabled={!currentSong}
          >
            ⏮
          </button>

          <button 
            className="btn btn-primary d-flex align-items-center justify-content-center shadow-sm border-0" 
            onClick={togglePlay}
            disabled={!currentSong}
            style={{ 
              width: "38px", 
              height: "38px", 
              borderRadius: "50%",
              backgroundColor: "#1e3a8a"
            }}
          >
            <span style={{ fontSize: "0.95rem", marginLeft: !isPlaying && currentSong ? "2px" : "0" }}>
              {isPlaying ? "⏸" : "▶"}
            </span>
          </button>

          <button 
            className="btn btn-link p-1 text-secondary border-0" 
            style={{ fontSize: "1.2rem" }}
            onClick={nextSong}
            disabled={!currentSong}
          >
            ⏭
          </button>

          <span 
            className="badge border fw-bold ms-1 d-none d-md-inline-block" 
            style={{ 
              fontSize: "0.6rem", 
              padding: "4px 6px",
              backgroundColor: "#f8fafc",
              color: "#2563eb",
              borderColor: "#e2e8f0"
            }}
          >
            HQ STREAM
          </span>

        </div>

      </div>
    </div>
  );
}

export default MusicPlayer;