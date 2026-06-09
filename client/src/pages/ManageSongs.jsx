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

  // Updated state: image field can now store a file object or a string URL fallback
  const [song, setSong] = useState({
    songName: "",
    singer: "",
    albumName: "",
    musicDirector: "",
    songUrl: "",
    image: null, 
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

  // New handler to process local file selection
  const handleFileChange = (e) => {
    setSong({
      ...song,
      image: e.target.files[0],
    });
  };

  const resetForm = () => {
    setSong({
      songName: "",
      singer: "",
      albumName: "",
      musicDirector: "",
      songUrl: "",
      image: null,
    });
    setEditId(null);
    
    // Clear the file input visually
    const fileInput = document.getElementById("songImageInput");
    if (fileInput) fileInput.value = "";
  };

  // Helper function to build FormData container for binary file transmissions
  const createFormData = () => {
    const formData = new FormData();
    formData.append("songName", song.songName);
    formData.append("singer", song.singer);
    formData.append("albumName", song.albumName);
    formData.append("musicDirector", song.musicDirector);
    formData.append("songUrl", song.songUrl);
    
    // 👇 FIX: Only send through the 'image' property if it's a genuine File object
    if (song.image instanceof File) {
      formData.append("image", song.image);
    } else if (typeof song.image === 'string') {
      // If it's a string, pass it along cleanly as a text property fallback
      formData.append("image", song.image);
    }
    return formData;
  };
  
  const addSong = async () => {
    try {
      const data = createFormData();
      // Appending headers config for multi-part forms
      await api.post("/songs", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Song Added Successfully");
      resetForm();
      fetchSongs();
    } catch (error) {
      console.log(error);
      alert("Error adding song");
    }
  };

  const updateSong = async () => {
    try {
      const data = createFormData();
      await api.put(`/songs/${editId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Song Updated Successfully");
      resetForm();
      fetchSongs();
    } catch (error) {
      console.log(error);
      alert("Error updating song");
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
      image: item.artworkUrl100 || null, // placeholder if backend already returns image path
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

        {/* Added File Upload Input Elements */}
        <div className="mb-3">
          <label htmlFor="songImageInput" className="form-label text-muted sm">
            Upload Album Cover Image
          </label>
          <input
            id="songImageInput"
            className="form-control"
            type="file"
            accept="image/*"
            name="image"
            onChange={handleFileChange}
          />
          {typeof song.image === 'string' && song.image && (
            <div className="mt-1 text-success small">Current Image: {song.image.split('/').pop()}</div>
          )}
        </div>

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