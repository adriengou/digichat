//import environment variables
import {PORT, MONGO_URI, SECRET, TEST} from "./config.js";
import cors from "cors"
//import express
import express from "express";

//import api routers
import userApiRoute from "./routes/user_api.js"
import roomApiRoute from "./routes/room_api.js"
import messageApiRoute from "./routes/message_api.js"

//import and connect mongoose
import mongoose from "mongoose";
await mongoose.connect(MONGO_URI);

//delete all collections -- USE FOR TESTING
// import {dropCollections} from "./utils/drop_collections.js";
// if (TEST){
//     await dropCollections()
// }

//http server import
import http from "http";

//import socket.io and create the server
import { Server } from "socket.io";

//chat functions import
import chat from "./chat.js";
import router from "./routes/message_api.js";

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

//cors middleware
app.options('*', cors()) // include before other routes
app.use(cors())

//json middleware
app.use(express.json());

//form data middleware
app.use(express.urlencoded({ extended: false }));

//static file serving
app.use(express.static("./public"));

//middleware for logging every info about the received request
app.use((req, res, next)=>{
    console.warn('----------------HTTP REQUEST---------------------')
    console.warn('date: ', new Date())
    console.warn('ip:', req.ip)
    console.warn('url:', req.url)
    console.warn('method: ', req.method)
    console.warn('params:', req.params)
    console.warn('headers:', req.headers)
    console.warn('body:', req.body)
    console.warn('-------------------------------------------------')
    return next()
})

//redirect to routes
app.use("/api/users", userApiRoute);
app.use("/api/rooms", roomApiRoute);
app.use("/api/messages", messageApiRoute)

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
