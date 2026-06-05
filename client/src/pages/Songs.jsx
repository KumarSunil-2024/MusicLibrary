import { useEffect, useState } from "react";
import axios from "axios";

import SidebarSongs from "../components/SidebarSongs";
import SearchBar from "../components/SearchBar";
import MusicPlayer from "../components/MusicPlayer";
import api from "../services/api";

function Songs() {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useState("");

  // Load Initial Songs
  const fetchSongs = async () => {
    try {
      const res = await axios.get(
        "https://itunes.apple.com/search?term=arijit&entity=song&limit=20",
      );
      setSongs(res.data.results);
      setCurrentSong(null);
    } catch (error) {
      console.log(error);
    }
  };

  // Load Playlists
  const fetchPlaylists = async () => {
    try {
      const res = await api.get("/playlists");
      setPlaylists(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSongs();
    fetchPlaylists();
  }, []);

  // Suggestions Search Handling
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length > 1) {
        axios
          .get(
            `https://itunes.apple.com/search?term=${search}&entity=song&limit=5`,
          )
          .then((res) => {
            setSuggestions(res.data.results);
          });
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const searchSongs = async () => {
    if (!search.trim()) return;
    try {
      const res = await axios.get(
        `https://itunes.apple.com/search?term=${search}&entity=song&limit=20`,
      );
      setSongs(res.data.results);
      setCurrentSong(null);
      setCurrentIndex(0);
      setSuggestions([]);
    } catch (error) {
      console.log(error);
    }
  };

  const selectSong = (song) => {
    const index = songs.findIndex((s) => s.trackId === song.trackId);
    setCurrentSong(song);
    setCurrentIndex(index >= 0 ? index : 0);
    setSearch(song.trackName);
    setSuggestions([]);
  };

  const playSong = (song, index) => {
    setCurrentSong(song);
    setCurrentIndex(index);
  };

  const nextSong = () => {
    if (currentIndex < songs.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      setCurrentSong(songs[next]);
    }
  };

  const previousSong = () => {
    if (currentIndex > 0) {
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      setCurrentSong(songs[prev]);
    }
  };

  const addToPlaylist = async () => {
    if (!currentSong) {
      alert("Select Song");
      return;
    }
    if (!playlistId) {
      alert("Select Playlist");
      return;
    }

    try {
      await api.put(`/playlists/${playlistId}/add-itunes-song`, {
        trackId: currentSong.trackId,
        trackName: currentSong.trackName,
        artistName: currentSong.artistName,
        albumName: currentSong.collectionName,
        artworkUrl: currentSong.artworkUrl100,
        previewUrl: currentSong.previewUrl,
        releaseDate: currentSong.releaseDate,
        genre: currentSong.primaryGenreName,
      });
      alert("Song Added To Playlist");
    } catch (error) {
      console.log(error);
      alert("Failed To Add Song");
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="row g-2">
        {/* Left Side: Scrollable Song Queue Panel */}
        <div className="col-md-4">
          <div
            className="card shadow-sm border-0 p-2"
            style={{ backgroundColor: "#fafbfc" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1 px-1">
              <h6
                className="fw-bold mb-0 text-secondary"
                style={{ fontSize: "0.85rem" }}
              >
                🎵 Track Queue
              </h6>
              <span
                className="badge bg-secondary rounded-pill"
                style={{ fontSize: "0.7rem" }}
              >
                Total: {songs.length}
              </span>
            </div>
            {/* Height locked around 8-9 songs, scroll internally to save page layout height */}
            <div
              style={{
                height: "390px",
                overflowY: "auto",
                paddingRight: "4px",
              }}
            >
              <SidebarSongs
                songs={songs}
                currentSong={currentSong}
                playSong={playSong}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Primary Control Workspace */}
        <div className="col-md-8 d-flex flex-column gap-2">
          {/* Global Search Bar Integration Element */}
          <SearchBar
            search={search}
            setSearch={setSearch}
            suggestions={suggestions}
            selectSong={selectSong}
            searchSongs={searchSongs}
          />

          {/* Clean Split Track Metadata & Fast Playlist Integration Box */}
          {currentSong && (
            <div className="card border-0 shadow-sm rounded-3 bg-white">
              <div className="card-body p-3">
                <div className="row align-items-start g-3">
                  {/* Left Side: Fixed Sized Album Art */}
                  <div className="col-auto">
                    <img
                      src={currentSong.artworkUrl100}
                      alt={currentSong.trackName}
                      className="rounded shadow-sm d-block"
                      style={{
                        width: "85px",
                        height: "85px",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Center: Premium Line-by-Line Split Layout */}
                  <div className="col min-w-0">
                    <span
                      className="badge bg-success mb-2"
                      style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}
                    >
                      NOW PLAYING
                    </span>

                    {/* 1. Song Title */}
                    <h5
                      className="fw-bold text-dark mb-2 text-truncate"
                      style={{ fontSize: "1.2rem" }}
                    >
                      {currentSong.trackName}
                    </h5>

                    {/* 2. Structured Metadata Grid */}
                    <div
                      className="row g-2 text-secondary"
                      style={{ fontSize: "0.78rem" }}
                    >
                      <div className="col-12 col-md-6 text-truncate">
                        <strong>🎤 Singer:</strong> {currentSong.artistName}
                      </div>
                      <div className="col-12 col-md-6 text-truncate">
                        <strong>📅 Release Date:</strong>{" "}
                        {currentSong.releaseDate?.split("T")[0] || "N/A"}
                      </div>
                      <div className="col-12 col-md-6 text-truncate">
                        <strong>💿 Album Name:</strong>{" "}
                        {currentSong.collectionName || "Single"}
                      </div>
                      <div className="col-12 col-md-6 text-truncate">
                        <strong>🎵 Music Director:</strong>{" "}
                        {currentSong.artistName}{" "}
                        {/* iTunes API uses artistName for composers/directors */}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Fast Playlist Injection Select Selector */}
                  <div className="col-md-3 border-start ps-3 align-self-center">
                    <label
                      className="form-label text-secondary fw-semibold mb-1"
                      style={{ fontSize: "0.725rem" }}
                    >
                      Add to Playlist
                    </label>
                    <div className="input-group input-group-sm">
                      <select
                        className="form-select text-truncate"
                        value={playlistId}
                        onChange={(e) => setPlaylistId(e.target.value)}
                      >
                        <option value="">Choose Playlist...</option>
                        {playlists.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn btn-success fw-bold"
                        onClick={addToPlaylist}
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Premium Music Player Module Insertion */}
          <div className="mt-auto">
            <MusicPlayer
              currentSong={currentSong}
              nextSong={nextSong}
              previousSong={previousSong}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Songs;
