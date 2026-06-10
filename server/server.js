require("dotenv").config();
// INITIALIZE ENV CONFIGURATION

const connectDB = require("./config/db");
// IMPORT DATABASE CONNECTOR

const { app, server } = require("./app"); 
// PULL APPLICATION SERVER INSTANCES

connectDB();
// EXECUTE DATABASE CONNECTION

const PORT = process.env.PORT || 5000;
// ASSIGN RUNTIME SYSTEM PORT

server.listen(PORT, () => {
  console.log(`🚀 Server listening with real-time sockets on port ${PORT}`);
});
// LAUNCH SERVER PROTOCOL LISTENERS