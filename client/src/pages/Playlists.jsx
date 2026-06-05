import { useEffect, useState } from "react";
import api from "../services/api";

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");

  // Synchronizes with the external system (API Backend) safely on mount
  const fetchPlaylists = async () => {
    try {
      const res = await api.get("/playlists");
      setPlaylists(res.data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const createPlaylist = async () => {
    if (!name.trim()) {
      alert("Enter Playlist Name");
      return;
    }

    try {
      await api.post("/playlists", { name });
      setName("");
      await fetchPlaylists();
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  const renamePlaylist = async (id) => {
    const newName = prompt("Enter New Playlist Name");
    if (!newName || !newName.trim()) return;

    try {
      await api.put(`/playlists/${id}`, { name: newName });
      await fetchPlaylists();
    } catch (error) {
      console.error("Error renaming playlist:", error);
    }
  };

  const deletePlaylist = async (id) => {
    if (!window.confirm("Are you sure you want to delete this playlist?"))
      return;

    try {
      await api.delete(`/playlists/${id}`);
      await fetchPlaylists();
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  const removeSong = async (playlistId, songId) => {
    try {
      await api.put(`/playlists/${playlistId}/remove-song/${songId}`);
      await fetchPlaylists();
    } catch (error) {
      console.error("Error removing song:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🎵 My Playlists</h2>

      {/* Create Playlist Layout */}
      <div className="card shadow p-3 mb-4">
        <h5>Create Playlist</h5>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Playlist Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn btn-success" onClick={createPlaylist}>
            Create
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search Song In Playlist"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Playlists Render Loops */}
      {playlists.length === 0 ? (
        <div className="alert alert-info">No Playlists Found</div>
      ) : (
        playlists.map((playlist) => {
          // FIXED: Computes variables dynamically inside the render loop on-the-fly.
          // This avoids using a secondary useEffect hook with synchronous cascading renders.
          const filteredSongs = playlist.songs
            ? playlist.songs.filter((song) =>
                song.trackName?.toLowerCase().includes(search.toLowerCase()),
              )
            : [];

          return (
            <div key={playlist._id} className="card shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4>{playlist.name}</h4>
                    <p className="text-muted mb-0">
                      Songs: {playlist.songs ? playlist.songs.length : 0}
                    </p>
                  </div>

                  <div>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => renamePlaylist(playlist._id)}
                    >
                      Rename
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deletePlaylist(playlist._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <hr />

                {/* Playlist Songs Display Container */}
                {filteredSongs.length === 0 ? (
                  <p className="text-muted italic-text">No Songs Found</p>
                ) : (
                  filteredSongs.map((song) => (
                    <div
                      key={`${playlist._id}-${song._id || song.trackId}`}
                      className="border rounded p-2 mb-2 d-flex justify-content-between align-items-center"
                    >
                      <div className="d-flex align-items-center gap-3">
                        {song.artworkUrl && (
                          <img
                            src={song.artworkUrl}
                            alt={song.trackName}
                            style={{
                              width: "45px",
                              height: "45px",
                              borderRadius: "6px",
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <div>
                          <strong>{song.trackName}</strong>
                          <br />
                          <small className="text-muted">
                            {song.artistName}
                          </small>
                        </div>
                      </div>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                          removeSong(playlist._id, song._id || song.trackId)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Playlists;