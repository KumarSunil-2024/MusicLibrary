const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

// IMPORT SYSTEM APPS ROUTERS
const authRoutes = require("./routes/authRoutes");
const songRoutes = require("./routes/songRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// WRAP APPS EXPRESS INSTANCE
const server = http.createServer(app);

// INITIALIZE SYSTEM SOCKET INSTANCE
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// GLOBAL ASSIGN SOCKET INSTANCE
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

// BASE ROOT HEALTH MIDDLEWARE
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Music Library API Running with Live Sockets",
  });
});

// ROUTER SYSTEM REGISTRY CONNECTIONS
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

// BIND SOCKET EVENT CHANNELS
io.on("connection", (socket) => {
  console.log(`⚡ Live Event Connection Formed: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`🔌 Client Disconnected from socket stream: ${socket.id}`);
  });
});

// WILDCARD SYSTEM FALLBACK MIDDLEWARE
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route Not Found" });
});

module.exports = { app, server };
// EXPORT APPLICATION SERVERS
