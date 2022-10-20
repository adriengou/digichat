import {Router} from "express";
import * as userController from "../mongodb/controllers/user_controller.js";


const router = new Router()

router.post("/register", (req, res)=>{
    let {username, email, password}  = req.body;
    const [user, error] = userController.addUser(email, username, password)

    if(!user){
        res.status(400).send(error)
    }else{
        res.status(201).json(user)
    }
})

router.post("/login", (req, res)=>{

})

export default router
