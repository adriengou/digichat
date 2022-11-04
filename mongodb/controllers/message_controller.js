import {User} from "../models/user_model.js";
import {Room} from "../models/room_model.js";
import {Message} from "../models/message_model.js";

export async function addFriendMessage(username, friendName, content) {
    // get user
    let user = await User.findOne({ username });
    if(!user){
        return [false, 'no user found']
    }
    await user.populate('friendsID')

    //get friend
    let friend = user.friendsID.find(elem => elem.username === friendName)
    if(!friend){
        return [false, 'friend not found']
    }

    let today = new Date()

    let createdMessage = await Message.create({
        userID:user._id,
        friendID:friend._id,
        date: today,
        content
    })

    user.sentMessagesID.push(createdMessage)
    await user.save()

    friend.receivedMessagesID.push(createdMessage)
    await friend.save()

    console.warn(createdMessage)

    return [createdMessage, '']
}

export async function getUserMessages(username, friendName) {
    const LIMIT = 50
    const OFFSET = 0

    // get user
    let user = await User.findOne({ username });
    if(!user){
        return [false, 'no user found']
    }

    let friend = await User.findOne({username:friendName})
    if(!friend){
        return [false, 'no friend found']
    }

    //check if tarek is sending himself a message
    if(user._id === friend._id){
        return [false, "tarek tu peux pas envoyer des messages à toi-même"]
    }


    let query = {$or: [{userID: user._id, friendID: friend._id}, {userID: friend._id, friendID: user._id}]}
    let messages = await Message.find(query, null, {limit:LIMIT, sort:{date:-1}})



    for (const message of messages) {
        await message.populate('userID', 'username')
        await message.populate('friendID', 'username')
    }

    messages = messages.reverse()

    return [messages, '']
}

export async function getAllUserMessages(username) {
    // get user
    let user = await User.findOne({ username });
    if(!user){
        return [false, 'no user found']
    }

    await user.populate({
        path:"sentMessagesID",
        options:{
            sort: { created: -1},
        }
    })
    await user.populate({
        path: "receivedMessagesID",
        options: {
            sort: { created: -1},
        }
    })

    for (let message of user.sentMessagesID) {
        await message.populate('friendID', 'username')
        await message.populate('userID', 'username')
    }

    for (let message of user.receivedMessagesID) {
        await message.populate('friendID', 'username')
        await message.populate('userID', 'username')
    }

    user.sentMessagesID.map(async message => {
        return {
            receiver: message.friendID,
            content: message.content,
            date: message.date
        }
    })

    user.receivedMessagesID.map(async message => {
        return {
            receiver: message.userID,
            content: message.content,
            date: message.date
        }
    })

    let allMessages = {
        received: user.receivedMessagesID,
        sent: user.sentMessagesID
    }

    return [allMessages, '']
}

export async function addRoomMessage(username, roomName, content){
    //get user
    let user = await User.findOne({ username });
    if(!user){
        return [false, 'no user found']
    }


    //get room
    await user.populate('roomsID')
    let room = user.roomsID.find(elem => elem.name === roomName)
    if(!room){
        return [false, 'room not found']
    }

    //create message
    let today = new Date()
    let createdMessage = await Message.create({
        userID: user._id,
        roomID: room._id,
        content,
        date:today
    })

    room.messagesID.push(createdMessage)
    await room.save()

    return [createdMessage, '']
}

export async function getRoomMessages(username, roomName){
    //get user
    let user = await User.findOne({ username });
    if(!user){
        return [false, 'no user found']
    }

    //get room
    await user.populate('roomsID')
    let room = user.roomsID.find(elem => elem.name === roomName)
    if(!room){
        return [false, 'room not found']
    }

    await room.populate('messagesID', 'content date userID')

    for (const message of room.messagesID) {
        await message.populate('userID', 'username')
    }

    let allMessages = room.messagesID

    return [allMessages, '']
}

export async function deleteMessage(query) {
    return (await Message.findOneAndDelete(query)) || false;
}

export async function updateMessage(query) {
    return (await Message.findOneAndUpdate(query)) || false;
}
