const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http"); // 👈 Import native HTTP server module
const { Server } = require("socket.io"); // 👈 Import Socket.io engine

const authRoutes = require("./routes/authRoutes");
const songRoutes = require("./routes/songRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// 1. Create an HTTP Server wrapper around Express instance
const server = http.createServer(app);

// 2. Initialize Socket.io and assign Cross-Origin Resource settings
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Points safely to your Vite dev environment
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// 3. Make the socket controller globally accessible across your Service Layers
global.io = io;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ success: true, message: "Music Library API Running with Live Sockets" });
});

// Routes Registration
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

// Socket Event Listening Bridge
io.on("connection", (socket) => {
  console.log(`⚡ Live Event Connection Formed: ${socket.id}`);
  
  socket.on("disconnect", () => {
    console.log(`🔌 Client Disconnected from socket stream: ${socket.id}`);
  });
});

// Wildcard Route Handlers
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route Not Found" });
});

// 🎯 FIX: Listen on the HTTP 'server' instance instead of 'app'!
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening with real-time sockets on port ${PORT}`);
});

module.exports = app;