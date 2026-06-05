
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

  // Load Songs

  const fetchSongs = async () => {
    try {
      const res = await axios.get(
        "https://itunes.apple.com/search?term=arijit&entity=song&limit=20"
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

  // Suggestions

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length > 1) {
        axios
          .get(
            `https://itunes.apple.com/search?term=${search}&entity=song&limit=5`
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

  // Search Songs

  const searchSongs = async () => {
    if (!search.trim()) return;

    try {
      const res = await axios.get(
        `https://itunes.apple.com/search?term=${search}&entity=song&limit=20`
      );

      setSongs(res.data.results);
      setCurrentSong(null);
      setCurrentIndex(0);
      setSuggestions([]);
    } catch (error) {
      console.log(error);
    }
  };

  // Select Song

  const selectSong = (song) => {
    const index = songs.findIndex(
      (s) => s.trackId === song.trackId
    );

    setCurrentSong(song);
    setCurrentIndex(index >= 0 ? index : 0);
    setSearch(song.trackName);
    setSuggestions([]);
  };

  // Play Song

  const playSong = (song, index) => {
    setCurrentSong(song);
    setCurrentIndex(index);
  };

  // Next Song

  const nextSong = () => {
    if (currentIndex < songs.length - 1) {
      const next = currentIndex + 1;

      setCurrentIndex(next);
      setCurrentSong(songs[next]);
    }
  };

  // Previous Song

  const previousSong = () => {
    if (currentIndex > 0) {
      const prev = currentIndex - 1;

      setCurrentIndex(prev);
      setCurrentSong(songs[prev]);
    }
  };

  // Add Song To Playlist

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
      await api.put(
        `/playlists/${playlistId}/add-itunes-song`,
        {
          trackId: currentSong.trackId,
          trackName: currentSong.trackName,
          artistName: currentSong.artistName,
          albumName: currentSong.collectionName,
          artworkUrl: currentSong.artworkUrl100,
          previewUrl: currentSong.previewUrl,
          releaseDate: currentSong.releaseDate,
          genre: currentSong.primaryGenreName,
        }
      );

      alert("Song Added To Playlist");
    } catch (error) {
      console.log(error);
      alert("Failed To Add Song");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">

        {/* Sidebar */}

        <div className="col-md-4 p-0">
          <SidebarSongs
            songs={songs}
            currentSong={currentSong}
            playSong={playSong}
          />
        </div>

        {/* Main Content */}

        <div className="col-md-8 p-4">

          <h2 className="mb-4">
            🎵 Music Library
          </h2>

          <SearchBar
            search={search}
            setSearch={setSearch}
            suggestions={suggestions}
            selectSong={selectSong}
            searchSongs={searchSongs}
          />

          {/* Song Details */}

          {currentSong && (
            <div className="card shadow-sm mb-3">
              <div className="card-body">

                <h5 className="mb-3">
                  🎵 Song Details
                </h5>

                <div className="row">

                  <div className="col-md-6">

                    <p>
                      <strong>Song Name:</strong>{" "}
                      {currentSong.trackName}
                    </p>

                    <p>
                      <strong>Singer:</strong>{" "}
                      {currentSong.artistName}
                    </p>

                    <p>
                      <strong>Album:</strong>{" "}
                      {currentSong.collectionName}
                    </p>

                  </div>

                  <div className="col-md-6">

                    <p>
                      <strong>Release Date:</strong>{" "}
                      {currentSong.releaseDate?.split("T")[0]}
                    </p>

                    <p>
                      <strong>Music Director:</strong>{" "}
                      {currentSong.artistName}
                    </p>

                    <p>
                      <strong>Genre:</strong>{" "}
                      {currentSong.primaryGenreName}
                    </p>

                  </div>

                </div>

              </div>
            </div>
          )}

          {/* Add To Playlist */}

          {currentSong && (
            <div className="card shadow-sm mb-3">
              <div className="card-body">

                <h5 className="mb-3">
                  ➕ Add To Playlist
                </h5>

                <select
                  className="form-select mb-3"
                  value={playlistId}
                  onChange={(e) =>
                    setPlaylistId(e.target.value)
                  }
                >
                  <option value="">
                    Select Playlist
                  </option>

                  {playlists.map((playlist) => (
                    <option
                      key={playlist._id}
                      value={playlist._id}
                    >
                      {playlist.name}
                    </option>
                  ))}
                </select>

                <button
                  className="btn btn-success"
                  onClick={addToPlaylist}
                >
                  Add Current Song
                </button>

              </div>
            </div>
          )}

          {/* Music Player */}

          <MusicPlayer
            currentSong={currentSong}
            nextSong={nextSong}
            previousSong={previousSong}
            songs={songs}
            currentIndex={currentIndex}
          />

          {/* Footer */}

          <div className="card shadow-sm mt-3">
            <div className="card-body">

              <h5>
                Songs Found : {songs.length}
              </h5>

              <p className="text-muted mb-0">
                Search songs, play music,
                view details and manage playlists.
              </p>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Songs;
