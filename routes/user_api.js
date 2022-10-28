import {Router} from "express";
import * as userController from "../mongodb/controllers/user_controller.js";
import {verifyRole, verifyToken} from "../middleware/auth_middleware.js";

const router = new Router()
//
//REGISTER
router.post("/register", async (req, res)=>{
    console.log(req.body)
    const [user, error] = await userController.addUser(req.body)

    if(!user){
        res.status(400).send(error)
    }else{
        res.status(200).json(user)
    }
})

//LOGIN
router.post("/login", async (req, res)=>{
    let {email, password} = req.body
    let [user, error] = await userController.loginUser(email, password)

    if(!user){
        res.status(400).send(error)
    }else{
        res.status(200).json(user)
    }
})


//ROUTES ABOVE DON'T NEED AUTH
router.use(verifyToken)
//ROUTES BELOW DO NEED AUTH

router.get('/profile', async (req, res)=>{
    let {username} = req.user
    let [result, error] = await userController.getProfile(username)

    if(!result){
        res.status(400).send(error)
    }else{
        res.status(200).json(result)
    }
})

router.get('/updateprofile', async (req, res)=>{
    let {username} = req.user
    let [result, error] = await userController.updateUser(username)

    if(!result){
        res.status(400).send(error)
    }else{
        res.status(200).json(result)
    }
})

router.get('/friends', async (req, res)=>{
    let {username} = req.user
    let [result, error] = await userController.getFriends(username)

    if(!result){
        res.status(400).send(error)
    }else{
        res.status(200).json(result)
    }
})



router.post("/addfriend", async(req, res)=>{
    let {username} = req.user
    let {friendName} = req.body

    let [result, error] = await userController.addFriend(username, friendName)

    if(!result){
        res.status(400).send(error)
    }else{
        res.status(200).json(result)
    }
})


router.post("/removefriend", async(req, res)=>{
    let {username} = req.user
    let {friendName} = req.body

    let [result, error] = await userController.removeFriend(username, friendName)

    if(!result){
        res.status(400).send(error)
    }else{
        res.status(200).json(result)
    }
})

router.get('/list', async (req, res) => {
    let {username} = req.user
    let [result, error] = await userController.getAllUsernames(username)

    if(!result){
        res.status(400).send(error)
    }else{
        res.status(200).json(result)
    }
})

//GET REGULAR INFOS OF A USER
router.get("/:username", async (req, res)=>{
    let {username} = req.params
    let [user, error] = await userController.getUserByUsername(username, false)

    if(!user){
        res.status(400).send(error)
    }else{
        res.status(200).json(user)
    }
})


//ROUTES ABOVE DON'T NEED ADMIN
router.use(async (req, res,next)=> {
    console.log(req.user)
    await verifyRole(req, res, next, "admin")
})
//ROUTES BELOW DO NEED ADMIN

//GET ALL INFOS OF A USER - REQUIRES ADMIN RIGHTS
router.get("/admin/:username", async (req, res)=>{
    let {username} = req.params
    let [user, error] = await userController.getUserByUsername(username, true)

    if(!user){
        res.status(400).send(error)
    }else{
        res.status(200).json(user)
    }
})



export default router
