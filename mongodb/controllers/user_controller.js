import validator from "validator";
import {SECRET, TEST} from "../../config.js";
import {User} from "../models/user_model.js";
import {Message} from "../models/message_model.js";
import {Room} from "../models/room_model.js";
import {missingParameters} from "../../utils/missing_parameters.js";
import {hashPassword} from "../../utils/hash_password.js";
import jwt from "jsonwebtoken";
import * as fs from "fs";

const {isEmail} = validator;


export async function addUser(query) {

    let {
        username,
        email,
        password,
        avatar,
        country,
        city,
        street,
        zipCode,
        phoneNumber,
        dialCode,
        firstName,
        lastName,
        skills,
        dateOfBirth
    } = query

    let requiredFields = {
        username,
        email,
        password,
        country,
        city,
        street,
        zipCode,
        phoneNumber,
        //dialCode,
        firstName,
        lastName,
        dateOfBirth
    }

    //validate mail
    if (!isEmail(email)) {
        [false, "invalid email"];
    }

    //check if the email is already used
    let user = await User.findOne({email});
    if (user) {
        return [false, "email already used"];
    }

    //check if user is already used
    user = await User.findOne({username});
    if (user) {
        return [false, "username already used"];
    }

    let [missing, param] = missingParameters(requiredFields);
    if (missing) {
        return [false, `${param} parameter missing`];
    }

    //hash the password
    const clearPassword = password
    password = hashPassword(password)

    //create the token
    const token = jwt.sign(
        {
            username, email, password
        },
        SECRET,
        {
            expiresIn: "720h",
        }
    )

    let userData = {
        username,
        email,
        password,
        avatar,
        country,
        city,
        street,
        zipCode,
        phoneNumber,
        dialCode,
        firstName,
        lastName,
        skills,
        token,
        dateOfBirth
    }

    // if (TEST){
    //     let users = await User.find() || [];
    //     let logUser = {...userData}
    //     logUser.clearPassword = clearPassword
    //     users.push(logUser)
    //     await fs.promises.writeFile("users.json", JSON.stringify(users))
    // }

    let createdUser = await User.create(userData)



    return [createdUser, ''];
}

export async function getUserByUsername(username, isAdmin){
    if (!username){
        return [false, "missing username param"]
    }

    let user = await User.findOne({username})

    if (!user) {
        return [false, "user not found"];
    }

    let userData = {}

    if (isAdmin){
        await user.populate("messagesID")
        await user.populate("roomsID")
        userData = user
    }else{
        let {firstName, lastName, username, avatar} = user
        userData = {firstName, lastName, username, avatar}
    }



    return [userData, '']

    //prenom, nom, image
}

export async function getAllUsernames(username) {
    if (!username){
        return [false, "missing username param"]
    }

    let user = await User.findOne({username})
    if (!user) {
        return [false, "user not found"];
    }

    let users = await User.find();

    if (!users) {
        return [false, "no users found"];
    }

    users = users.map(elem => {
        return {
            username: elem.username,
            firstName: elem.firstName,
            lastName: elem.lastName,
            avatar: elem.avatar,
        }
    })

    return [users, ''];
}



export async function deleteUser(query) {
    return (await User.findOneAndDelete(query)) || false;
}

export async function updateUser(filter, update) {
    let userData = {
        username: update.username,
        email: update.email,
        password: update.password,
        country: update.country,
        city: update.city,
        street: update.street,
        zipCode: update.zipCode,
        phoneNumber: update.phoneNumber,
        dialCode: update.dialCode,
        firstName: update.firstName,
        lastName: update.lastName,
        skills: update.skills,
    }
    return (await User.findOneAndUpdate(filter, userData)) || false;
};

export async function loginUser(email, password) {
    let [missing, param] = missingParameters({email, password});
    if (missing) {
        return [false, `${param} parameter missing`];
    }

    //validate mail
    if (!isEmail(email)) {
        [false, "invalid email"];
    }

    let clearPassword = password
    password = hashPassword(password)

    let user = await User.findOne({email});

    if (!user) {
        return [false, "wrong credentials"];
    }

    if (user.password !== password) {
        return [false, "wrong credentials"]
    }

    //create the token
    const token = jwt.sign(
        {
            username: user.username,
            email,
            password
        },
        SECRET,
        {
            expiresIn: "720h",
        }
    )

    user.token = token

    user.isLoggedIn = true
    await user.save()

    if (TEST){
        let users = [...(await User.find())];
        users = users.map((u)=>{
            let newU = {...u}
            newU.clearPassword = clearPassword
            return newU
        })
        await fs.promises.writeFile("users.json", JSON.stringify(users))
    }

    return [user, '']
}


export async function getUserRole(username){
    console.log(username)

    let [missing, param] = missingParameters({username});
    if (missing) {
        return [false, `${param} parameter missing`];
    }

    let user = await User.findOne({username})
    console.log(user)
    if (!user) {
        return [false, "user not found"];
    }

    return [user.role, '']
}

export async function addFriend(username, friendName){
    let user = await User.findOne({username})
    if (!user){
        return [false, 'user not found']
    }

    let friend = await User.findOne({username: friendName})
    if(!friend){
        return [false, 'friend user not found']
    }

    user.friendsID.push(friend)
    await user.save()

    return [true, '']
}

export async function removeFriend(username, friendName){
    let user = await User.findOne({username})
    if (!user){
        return [false, 'user not found']
    }

    await user.populate("friendsID")

    let isFriend = user.friendsID.find(elem => elem.username === friendName)
    if(!isFriend){
        return [false, 'friend not found']
    }

    user.friendsID = user.friendsID.filter(elem => elem.username !== friendName)

    await user.save()

    return [true, '']
}

export async function getFriends(username){
    let user = await User.findOne({username})
    if (!user){
        return [false, 'user not found']
    }

    await user.populate('friendsID', 'username firstName lastName avatar')
    return [user.friendsID, '']
}