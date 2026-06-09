const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http"); 
const { Server } = require("socket.io"); 

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
    origin: "http://localhost:5173", 
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

// 🎯 CRITICAL FIX: Export BOTH entities cleanly as an object wrapper (No inline server.listen here!)
module.exports = { app, server };