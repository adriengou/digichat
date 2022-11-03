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

export async function getUserMessages(username) {
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
            from:message.userID,
            receiver: message.friendID,
            content: message.content,
            date: message.date
        }
    })

    user.receivedMessagesID.map(async message => {
        return {
            from:message.friendID,
            receiver: message.userID,
            content: message.content,
            date: message.date
        }
    })

    let allMessages = {
        received: user.receivedMessagesID,
        sent: user.sentMessagesID
    }

    //GET 50 MESSAGES PER USERS - 25 SENT / 25 RECEIVED
    const OFFSET = 0
    const LIMIT = 25
    let sentMessagesPerUser = {}
    let receivedMessagesPerUser = {}

    let limitedMessages = {
        received: [],
        sent:[]
    }
    for (let i = 0; i < allMessages.received.length; i++) {
        let message = allMessages.received[i]
        let from = message.from.username

        receivedMessagesPerUser[from] = receivedMessagesPerUser[from] || 0

        if(receivedMessagesPerUser[from] >= LIMIT){
            break;
        }

        limitedMessages.received.push(message)
        receivedMessagesPerUser[from] = receivedMessagesPerUser[from] + 1
    }

    for (let i = 0; i < allMessages.sent.length; i++) {
        let message = allMessages.sent[i]
        let to = message.receiver.username

        sentMessagesPerUser[to] = sentMessagesPerUser[to] || 0

        if(sentMessagesPerUser[to] >= LIMIT){
            break;
        }

        limitedMessages.sent.push(message)
        sentMessagesPerUser[to] = sentMessagesPerUser[to] + 1
    }



    return [limitedMessages, '']
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
