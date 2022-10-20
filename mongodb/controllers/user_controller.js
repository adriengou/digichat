import validator from "validator";
import {SECRET} from "../../config.js";
import {User} from "../models/user_model.js";
import {missingParameters} from "../../utils/missing_parameters.js";
import {hashPassword} from "../../utils/hash_password.js";
import jwt from "jsonwebtoken";
const { isEmail } = validator;


export async function addUser(email, username, password){
    //validate mail
    if (!isEmail(email)) {
        [false, "invalid email"];
    }

    //check if the email is already used
    let user = await User.findOne({ email });
    if (user) {
        return [false, "email already used"];
    }

    //check if user is already used
    user = await User.findOne({ username });
    if (user) {
        return [false, "username already used"];
    }

    let [missing, param] = missingParameters({ username, email, password });
    if (missing) {
        return [false, `${param} parameter missing`];
    }

    //hash the password
    let hashedPassword = hashPassword(password)

    //create the token
    const token = jwt.sign(
        {
            username, email, password:hashedPassword
        },
        SECRET,
        {
            expiresIn:"1h",
        }
    )

    return await User.create({ username, email, password:hashedPassword, token });
}

export async function getAllUser(query){
    let users = await User.find(query);

    if (!users) {
        return [false, "no users found"];
    }

    //populate messages and rooms
    for (const user of users) {
        await user.populate("messagesID");
        await user.populate("roomsID");
    }

    return users;
}

export async function deleteUser(query) {
    return (await User.findOneAndDelete(query)) || false;
}

export async function updateUser(query) {
    return (await User.findOneAndUpdate(query)) || false;
};

export async function loginUser(username, password){
    let hashedPassword = hashPassword(password)

    let user = await User.findOne({username});

    if (!user) {
        return [false, "wrong credentials"];
    }

    if (user.password !== hashedPassword){
        return [false, "wrong credentials"]
    }


    user.isLoggedIn = true
    user.save()

    return user.isLoggedIn
}