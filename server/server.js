require("dotenv").config();
const connectDB = require("./config/db");
// 🎯 Pull both instances safely from the app module assembly
const { app, server } = require("./app"); 

connectDB();

const PORT = process.env.PORT || 5000;

// 🎯 LISTEN ONLY ON THE HTTP SERVER WRAPPER FOR SOCKETS
server.listen(PORT, () => {
  console.log(`🚀 Server listening with real-time sockets on port ${PORT}`);
});