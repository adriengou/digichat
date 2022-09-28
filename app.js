import express from "express";
import path from "path";

//import dotenv
import dotenv from "dotenv";
//get the config from .env file
dotenv.config();

//http server import
import http from "http";

//import socket.io and create the server
import { Server } from "socket.io";

//routers imports
import userRouter from "./routes/users_routes.js";

//chat functions import
import chat from "./chat.js";

let app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer);

//json middleware
app.use(express.json());

//form data middleware
app.use(express.urlencoded({ extended: false }));

//static file serving
app.use(express.static("./public"));

//root get request
app.get("/", function (req, res) {
  res.sendFile("public/index.html");
});

app.use("/users", userRouter);

//SOCKET IO ROUTES--------------
//when a user connects
io.on("connection", function (socket) {
  chat(io, socket);
});

//------------------------------

httpServer.listen(process.env.PORT, function () {
  console.log(`Server running on port ${process.env.PORT}`);
});
