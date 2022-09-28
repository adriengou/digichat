function connection(io, socket) {
  console.log(`User ${socket.id} connected`);

  //Socket io routes
  socket.on("message", function (message) {
    clientMessage(io, socket, message);
  });
}

function clientMessage(io, socket, message) {
  console.log(`User ${socket.id} sent: ${message}`);

  io.emit("message", `${socket.id}: ${message}`);
}

export default connection;
