import { useEffect, useState } from "react";
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

const fetchSongs = async () => {
try {
const res = await api.get("/songs");


  const formattedSongs = res.data.map((song) => ({
    trackId: song._id,
    trackName: song.songName,
    artistName: song.singer,
    collectionName: song.albumName,
    artworkUrl100:
      song.artworkUrl100 || "/default-music.png",
    previewUrl: song.songUrl,
    releaseDate: song.createdAt,
    musicDirector: song.musicDirector,
    isAdminSong: true,
  }));

  setSongs(formattedSongs);
} catch (error) {
  console.log(error);
}


};

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

useEffect(() => {
if (!search.trim()) {
setSuggestions([]);
return;
}


const filtered = songs.filter(
  (song) =>
    song.trackName
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    song.artistName
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    song.collectionName
      .toLowerCase()
      .includes(search.toLowerCase())
);

setSuggestions(filtered.slice(0, 5));

}, [search, songs]);

const searchSongs = () => {
if (!search.trim()) {
fetchSongs();
return;
}

const filtered = songs.filter(
  (song) =>
    song.trackName
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    song.artistName
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    song.collectionName
      .toLowerCase()
      .includes(search.toLowerCase())
);

setSongs(filtered);


};

const selectSong = (song) => {
const index = songs.findIndex(
(s) => s.trackId === song.trackId
);


setCurrentSong(song);
setCurrentIndex(index);
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
  await api.put(
    `/playlists/${playlistId}/add-song`,
    {
      trackId: currentSong.trackId,
      trackName: currentSong.trackName,
      artistName: currentSong.artistName,
      albumName: currentSong.collectionName,
      artworkUrl:
        currentSong.artworkUrl100,
      previewUrl:
        currentSong.previewUrl,
      releaseDate:
        currentSong.releaseDate,
    }
  );

  alert("Song Added To Playlist");
} catch (error) {
  console.log(error);
  alert("Failed To Add Song");
}


};

return ( <div className="container-fluid py-2"> <div className="row g-2">


    <div className="col-md-4">
      <div className="card shadow-sm border-0 p-2">
        <div
          style={{
            height: "390px",
            overflowY: "auto",
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

    <div className="col-md-8 d-flex flex-column gap-2">

      <SearchBar
        search={search}
        setSearch={setSearch}
        suggestions={suggestions}
        selectSong={selectSong}
        searchSongs={searchSongs}
      />

      {currentSong && (
        <div className="card shadow-sm">
          <div className="card-body">

           <img
  src={
    currentSong.artworkUrl100 ||
    "/default-music.png"
  }
  onError={(e) => {
    e.target.src =
      "/default-music.png";
  }}></img>
            <h4>
              {currentSong.trackName}
            </h4>

            <span className="badge bg-primary">
              Library Song
            </span>

            <p>
              Singer:
              {currentSong.artistName}
            </p>

            <p>
              Album:
              {currentSong.collectionName}
            </p>

            <p>
              Music Director:
              {currentSong.musicDirector}
            </p>

            <select
              className="form-select"
              value={playlistId}
              onChange={(e) =>
                setPlaylistId(
                  e.target.value
                )
              }
            >
              <option value="">
                Select Playlist
              </option>

              {playlists.map((p) => (
                <option
                  key={p._id}
                  value={p._id}
                >
                  {p.name}
                </option>
              ))}
            </select>

            <button
              className="btn btn-success mt-2"
              onClick={addToPlaylist}
            >
              Add To Playlist
            </button>

          </div>
        </div>
      )}

      <MusicPlayer
        currentSong={currentSong}
        nextSong={nextSong}
        previousSong={previousSong}
      />
    </div>
  </div>
</div>


);
}

export default Songs;
