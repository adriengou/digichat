import {Router} from "express";
import * as roomController from "../mongodb/controllers/room_controller.js";
import {verifyRole, verifyToken} from "../middleware/auth_middleware.js";
import {addRoomUser} from "../mongodb/controllers/room_controller.js";

const router = new Router()

// const [user, error] = await userController.addUser(req.body)
//
// if(!user){
//     res.status(400).send(error)
// }else{
//     res.status(200).json(user)
// }


//ROUTES ABOVE DON'T NEED AUTH
router.use(verifyToken)
//ROUTES BELOW DO NEED AUTH

//CREATE ROOM
router.post("/create", async (req, res, next)=>{
    let username = req.user.username
    let roomName = req.body.roomName

    let [room, error] = await roomController.addRoom(username, roomName)

    if(!room){
        res.status(400).send(error)
    }else{
        res.status(200).json(room)
    }
})

//GET SOME INFOS OF A ROOM
router.get("/:roomName", async (req, res)=>{
    let {roomName} = req.params
    let username = req.user.username

    let [user, error] = await roomController.getRoomByName(username, roomName, false)

    if(!user){
        res.status(400).send(error)
    }else{
        res.status(200).json(user)
    }
})

//ADD A USER TO THE ROOM
router.post('/adduser', async (req, res)=>{
    let ownerName = req.user.username
    let username = req.body.username
    let roomName = req.body.roomName

    let [room, error] = await roomController.addRoomUser(ownerName, roomName, username)

    if(!room){
        res.status(400).send(error)
    }else{
        res.status(200).json(room)
    }
})

//REMOVE A USER FROM THE ROOM
router.post('/removeuser', async (req, res)=>{
    let ownerName = req.user.username
    let username = req.body.username
    let roomName = req.body.roomName

    let [result, error] = await roomController.removeRoomUser(ownerName, roomName, username)

    if(!result){
        res.status(400).send(error)
    }else{
        res.status(200).json(result)
    }
})

//DELETE THE ROOM
router.post('/delete', async (req, res)=>{
    let ownerName = req.user.username
    let roomName = req.body.roomName

    let [result, error] = await roomController.deleteRoom(ownerName, roomName)

    if(!result){
        res.status(400).send(error)
    }else{
        res.status(200).json(result)
    }
})




//ROUTES ABOVE DON'T NEED ADMIN
router.use(async (req, res,next)=> {
    console.log(req.user)
    await verifyRole(req, res, next, "admin")
})
//ROUTES BELOW DO NEED ADMIN


//GET ALL INFOS OF A ROOM - REQUIRES ADMIN RIGHTS
router.get("/admin/:roomName", async (req, res)=>{
    let {roomName} = req.params
    let username = req.user.username
    let [user, error] = await roomController.getRoomByName(username, roomName, true)

    if(!user){
        res.status(400).send(error)
    }else{
        res.status(200).json(user)
    }
})


export default router