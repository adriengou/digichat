import {Router} from "express";
import * as messageController from "../mongodb/controllers/message_controller.js";
import {verifyRole, verifyToken} from "../middleware/auth_middleware.js";
import * as userController from "../mongodb/controllers/user_controller.js";


const router = new Router()



//ROUTES ABOVE DON'T NEED AUTH
router.use(verifyToken)
//ROUTES BELOW DO NEED AUTH



router.post("/addfriendmessage", async (req, res)=>{
    let {username} = req.user
    let {friendName, content} = req.body

    const [result, error] = await messageController.addFriendMessage(username, friendName, content)

    if(!result){
        res.status(400).send(error).end()
    }else{
        res.status(200).json(result).end()
    }
})

router.get("/friendmessages", async (req, res)=>{

    let {username} = req.user

    const [result, error] = await messageController.getAllUserMessages(username)

    if(!result){
        res.status(400).send(error)
    }else{
        console.warn("message: ", result.length)
        res.status(200).json(result)
    }
})

router.get("/friendmessages/:friendName", async (req, res)=>{
    let {username} = req.user
    let {friendName} = req.params

    const [result, error] = await messageController.getUserMessages(username, friendName)

    if(!result){
        res.status(400).send(error)
    }else{
        //console.warn("message: ", result)
        res.status(200).json(result)
    }
})






router.post("/addroommessage", async (req, res)=>{

    let {username} = req.user
    let {roomName, content} = req.body

    const [result, error] = await messageController.addRoomMessage(username, roomName, content)

    if(!result){
        res.status(400).send(error)
    }else{
        res.status(200).json(result)
    }
})

router.get("/roommessages/:roomName", async (req, res)=>{

    let {username} = req.user
    let {roomName} = req.params

    const [result, error] = await messageController.getRoomMessages(username, roomName)

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

export default router