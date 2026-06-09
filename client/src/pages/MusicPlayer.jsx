import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Square } from "lucide-react";

function MusicPlayer({ currentSong, nextSong, previousSong }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeline, setTimeline] = useState({ current: 0, total: 0 });
  const [modes, setModes] = useState({ repeat: false, shuffle: false });

  // Auto-play toggle on source track change
  useEffect(() => {
    const player = audioRef.current;
    if (player && currentSong?.previewUrl) {
      player.load();
      player.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Playback interaction paused:", err.message));
    } else {
      setIsPlaying(false);
    }
  }, [currentSong]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(e => console.log(e));
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const stopSong = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setTimeline(prev => ({ ...prev, current: 0 }));
  }, []);

  const handleAudioMeta = useCallback((e) => {
    setTimeline({
      current: e.target.currentTime,
      total: e.target.duration || 0
    });
  }, []);

  const handleSeek = useCallback((e) => {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setTimeline(prev => ({ ...prev, current: val }));
  }, []);

  const handleSongEnd = useCallback(() => {
    if (modes.repeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log(e));
    } else {
      nextSong();
    }
  }, [modes.repeat, nextSong]);

  const formatTime = useCallback((time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  if (!currentSong) {
    return (
      <div className="card text-center border p-3 shadow-sm bg-white" style={{ borderRadius: "10px" }}>
        <h6 className="fw-bold text-muted m-0">No Track Selected</h6>
      </div>
    );
  }

  return (
    <div className="card border shadow-sm mt-auto bg-white" style={{ borderRadius: "12px" }}>
      <audio
        ref={audioRef}
        key={currentSong.trackId}
        src={currentSong.previewUrl}
        onTimeUpdate={handleAudioMeta}
        onLoadedMetadata={handleAudioMeta}
        onEnded={handleSongEnd}
      />

      <div className="card-body p-3">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          
          {/* Identity Info Panel */}
          <div className="d-flex align-items-center gap-2 text-center text-md-start" style={{ minWidth: "200px" }}>
            <img
              src={currentSong.artworkUrl100 || "/default-music.png"}
              alt="Art"
              style={{ width: "46px", height: "46px", borderRadius: "6px", objectFit: "cover" }}
              onError={e => e.target.src = "/default-music.png"}
            />
            <div style={{ maxWidth: "150px", overflow: "hidden" }}>
              <p className="mb-0 fw-bold text-dark text-truncate text-start" style={{ fontSize: "0.85rem" }}>{currentSong.trackName}</p>
              <small className="text-muted text-truncate d-block text-start" style={{ fontSize: "0.75rem" }}>{currentSong.artistName}</small>
            </div>
          </div>

          {/* Central Controls & Linear Input Timeline */}
          <div className="d-flex flex-column align-items-center gap-1 flex-grow-1 w-100" style={{ maxWidth: "440px" }}>
            <div className="d-flex align-items-center gap-3 mb-1">
              <button className="btn btn-link p-1 border-0 bg-transparent" style={{ color: modes.shuffle ? "#10b981" : "#9ca3af" }} onClick={() => setModes(p => ({ ...p, shuffle: !p.shuffle }))}>
                <Shuffle size={16} />
              </button>
              <button className="btn btn-link p-1 border-0 bg-transparent text-secondary" onClick={previousSong}>
                <SkipBack size={18} fill="#6b7280" />
              </button>
              <button className="btn d-flex align-items-center justify-content-center shadow-sm border-0" style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#1e3a8a", color: "#ffffff" }} onClick={togglePlay}>
                {isPlaying ? <Pause size={16} fill="#ffffff" /> : <Play size={16} fill="#ffffff" className="ms-0.5" />}
              </button>
              <button className="btn btn-link p-1 border-0 bg-transparent text-secondary" onClick={nextSong}>
                <SkipForward size={18} fill="#6b7280" />
              </button>
              <button className="btn btn-link p-1 border-0 bg-transparent" style={{ color: modes.repeat ? "#10b981" : "#9ca3af" }} onClick={() => setModes(p => ({ ...p, repeat: !p.repeat }))}>
                <Repeat size={16} />
              </button>
              <button className="btn btn-link p-1 border-0 bg-transparent text-danger opacity-70" onClick={stopSong}>
                <Square size={14} fill="#ef4444" />
              </button>
            </div>

            <div className="d-flex align-items-center gap-2 w-100">
              <span className="text-muted" style={{ fontSize: "0.7rem", minWidth: "30px", textAlign: "right" }}>{formatTime(timeline.current)}</span>
              <input type="range" className="form-range flex-grow-1" min="0" max={timeline.total} value={timeline.current} onChange={handleSeek} style={{ height: "4px", cursor: "pointer", accentColor: "#1e3a8a" }} />
              <span className="text-muted" style={{ fontSize: "0.7rem", minWidth: "30px" }}>{formatTime(timeline.total)}</span>
            </div>
          </div>

          {/* Right Utility Badge */}
          <div className="d-none d-md-flex align-items-center gap-2 text-secondary" style={{ width: "120px", justifyContent: "flex-end" }}>
            <span className="badge bg-light text-secondary border fw-medium" style={{ fontSize: "0.6rem", letterSpacing: "0.5px" }}>HQ STREAM</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;