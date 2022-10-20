//import environment variables
import {PORT, MONGO_URI, SECRET} from "./config.js";

//import express
import express from "express";

//import api routers
import userApiRoute from "./apis/user_api.js"

//import and connect mongoose
import mongoose from "mongoose";
await mongoose.connect(MONGO_URI);

//http server import
import http from "http";

//import socket.io and create the server
import { Server } from "socket.io";

//chat functions import
import chat from "./chat.js";

let app = express();

const httpServer = http.createServer(app);
const io = new Server(
    httpServer,
    {
      cors:{
        origin:"*",
        methods:["GET", "POST"]
      }
    });


//json middleware
app.use(express.json());

//form data middleware
app.use(express.urlencoded({ extended: false }));

//static file serving
app.use(express.static("./public"));

//redirect to apis
app.use("/api/users", userApiRoute);

//root get request
app.get("/", function (req, res) {
  res.sendFile("public/index.html");
});


//SOCKET IO ROUTES--------------
//when a user connects
io.on("connection", function (socket) {
  console.log(`socket id: ${socket.id}`)
  chat(io, socket);
});

//------------------------------
httpServer.listen(PORT, function () {
  console.log(`Server running on port ${PORT}`);
});
