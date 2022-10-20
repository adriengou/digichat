import {User} from "../models/user_model.js";
import {Room} from "../models/room_model.js";
import {Message} from "../models/message_model.js";

export async function addMessage(username, roomName, date, content) {
    // get user
    let user = await User.findOne({ username });

    // get room
    let room = await Room.findOne({ name: roomName });

    let createdMessage = await Message.create({
        userID: user,
        roomID: room,
        date: date,
        content: content,
    });

    await createdMessage.populate("userID");
    await createdMessage.populate("roomID");

    user.messagesID.push(createdMessage);
    await user.save();

    room.messagesID.push(createdMessage);
    await room.save();

    return createdMessage;
}

export async function getMessage(query) {
    let messages = await Message.find(query);
    if (!messages) {
        return [false, "no messages found"];
    }

    //populate users and rooms
    for (const message of messages) {
        await message.populate("userID");
        await message.populate("roomID");
    }
    return messages;
}

export async function deleteMessage(query) {
    return (await Message.findOneAndDelete(query)) || false;
}

export async function updateMessage(query) {
    return (await Message.findOneAndUpdate(query)) || false;
}
