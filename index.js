// Import required modules
const express = require("express");
const http = require("http");
const socket = require("socket.io");

// Create an Express app instance
const app = express();
// Create an HTTP server using the Express app
const server = http.createServer(app);
// Create a Socket.IO instance attached to the server
const io = socket(server);

// Serve static files from the "public" directory
app.use(express.static("public"));

// Maintain an array of connected sockets
let connections = [];

// Handle socket connections
io.on("connect", (socket) => {
  // Add the connected socket to the array
  connections.push(socket);
  // Log when a socket connects, using its unique ID
  console.log(`Socket ${socket.id} got connected`);

  // Reusable function to broadcast events to all connected sockets except the sender
  function broadcastEvent(eventName, socket, eventData) {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit(eventName, eventData);
      }
    });
  }

  // Socket event listeners
  socket.on("draw", (data) => {
    broadcastEvent("ondraw", socket, { x: data.x, y: data.y });
  });

  socket.on("down", (data) => {
    broadcastEvent("ondown", socket, { x: data.x, y: data.y });
  });

  // Handle socket disconnections
  socket.on("disconnect", (reason) => {
    // Remove the disconnected socket from the array
    connections = connections.filter((con) => con.id !== socket.id);
    // Log when a socket disconnects, using its unique ID
    console.log(`Socket ${socket.id} got disconnected`);
  });
});

// Define a route for the root URL
app.get("/", (req, res) => {
  res.send("<h1>On board in</h1>");
});

// Start the server and listen on port 5000
server.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
