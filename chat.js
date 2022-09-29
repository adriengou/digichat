//import mongo main.js to connect to the database
import database from "./mongodb/main.js";

function connection(io, socket) {
  console.log(`User ${socket.id} connected`);
  socket.emit("client id", socket.id);
  io.emit("user joined", socket.id);

  //Socket io routes
  socket.on("message", function (message) {
    clientMessage(io, socket, message);
  });

  socket.on("disconnect", function () {
    clientDisconnect(io, socket);
  });
}

function clientMessage(io, socket, message) {
  console.log(`User ${socket.id} sent: ${message}`);

  io.emit("message", socket.id, message);
}

function clientDisconnect(io, socket) {
  console.log(`User ${socket.id} disconnected`);
  io.emit("user left", socket.id);
}
export default connection;
