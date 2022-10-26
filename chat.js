//import mongo main.js to connect to the database
//import database from "./mongodb/requests.js";
import jwt from "jsonwebtoken"
import {SECRET} from "./config.js";
import * as messageController from "./mongodb/controllers/message_controller.js";
import * as userController from "./mongodb/controllers/user_controller.js";
import * as roomController from "./mongodb/controllers/room_controller.js";

let users = {}

function connection(io, socket) {
    socket.on('login', data => {
        let decoded
        try {
            decoded = jwt.verify(data.token, SECRET);
        } catch (err) {
            socket.emit('login error')
            return
        }

        let {username} = decoded

        users[username] = socket

        loadEvents(io, socket, username)
    })
}

function loadEvents(io, socket, username){
    //send friend message --------------------
    socket.on('send friend message', async (data) => {
        let {friendName, content} = data

        const [result, error] = await messageController.addFriendMessage(username, friendName, content)

        if(!result){
            socket.emit('error', error)
            return
        }

        //send message to sender
        socket.emit("friend message sent", data)

        //send message to receiver
        if(users[friendName]){
            users[friendName].emit("friend message", {from: username, content})
        }

    })

    socket.on('send room message', async (data) => {
        let {roomName, content} = data

        const [result, error] = await messageController.addRoomMessage(username, roomName, content)

        if(!result){
            socket.emit('error', error)
            return
        }

        //send message to sender
        socket.emit("room message sent", data)

        //get room infos
        let room = result.roomID
        await room.populate('usersID')

        //add every users of the room to the socketio room
        room.usersID.forEach(user=> {
            if (users[user.username]){
                users[user.username].join(roomName)
            }
        })
        io.to(roomName).emit('room message', {roomName, from:username, content})
    })

    socket.on('disconnect', ()=>{
        delete users[username]
    })
}

export default connection;
