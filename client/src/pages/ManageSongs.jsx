import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

function ManageSongs() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" />;
  }

  const [songs, setSongs] = useState([]);

  const [editId, setEditId] = useState(null);

  const [song, setSong] = useState({
    songName: "",
    singer: "",
    albumName: "",
    musicDirector: "",
    songUrl: "",
  });

  const fetchSongs = async () => {
    try {
      const res = await api.get("/songs");

      setSongs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleChange = (e) => {
    setSong({
      ...song,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setSong({
      songName: "",
      singer: "",
      albumName: "",
      musicDirector: "",
      songUrl: "",
    });

    setEditId(null);
  };

  const addSong = async () => {
    try {
      await api.post("/songs", song);

      alert("Song Added Successfully");

      resetForm();

      fetchSongs();
    } catch (error) {
      console.log(error);
    }
  };

  const updateSong = async () => {
    try {
      await api.put(`/songs/${editId}`, song);

      alert("Song Updated Successfully");

      resetForm();

      fetchSongs();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSong = async (id) => {
    const confirmDelete = window.confirm("Delete this song?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/songs/${id}`);

      fetchSongs();
    } catch (error) {
      console.log(error);
    }
  };

  const editSong = (item) => {
    setEditId(item._id);

    setSong({
      songName: item.songName,
      singer: item.singer,
      albumName: item.albumName,
      musicDirector: item.musicDirector,
      songUrl: item.songUrl,
    });
  };

  return (
    <div className="container mt-4">
      <h2>Manage Songs</h2>

      <div className="card p-3 mb-4">
        <input
          className="form-control mb-2"
          placeholder="Song Name"
          name="songName"
          value={song.songName}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          placeholder="Singer"
          name="singer"
          value={song.singer}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          placeholder="Album"
          name="albumName"
          value={song.albumName}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          placeholder="Music Director"
          name="musicDirector"
          value={song.musicDirector}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          placeholder="Song URL"
          name="songUrl"
          value={song.songUrl}
          onChange={handleChange}
        />

        <button
          className="btn btn-success"
          onClick={editId ? updateSong : addSong}
        >
          {editId ? "Update Song" : "Add Song"}
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Song</th>

            <th>Singer</th>

            <th>Album</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {songs.map((item) => (
            <tr key={item._id}>
              <td>{item.songName}</td>

              <td>{item.singer}</td>

              <td>{item.albumName}</td>

              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => editSong(item)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteSong(item._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageSongs;
