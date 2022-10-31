import jwt from "jsonwebtoken"
import {SECRET} from "../config.js";
import {getUserRole} from "../mongodb/controllers/user_controller.js";

/**
 *
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
export function verifyToken(req, res, next){
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send("Forbidden");
    }

    // console.log(req.headers)
    token = token.split(" ")[1]

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Unauthorized");
    }
    return next();
}


/**
 *
 * @param req
 * @param res
 * @param next
 * @param roleName
 * @return {Promise<*>}
 */
export async function verifyRole(req, res, next, roleName){
    let {username} = req.user
    let [role, error] = await getUserRole(req.user.username)

    if (role !== roleName){
        return res.status(500).send("You are not " + roleName)
    }

    return next()
}