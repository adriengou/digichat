import {User} from "../models/user_model.js";
import {Room} from "../models/room_model.js";

export async function addRoom(ownerUsername, roomName) {
    //check if a room already exists with the name
    if (await Room.findOne({ name: roomName })) {
        return [false, "room name already used"];
    }

    //get the owner document
    let owner = await User.findOne({ username: ownerUsername });
    if (!owner) {
        return [false, "owner does not exists"];
    }

    //create the room set the owner as room owner and user

    const createdRoom = await Room.create({
        name: roomName,
        ownersID: [owner],
        usersID: [owner],
    });

    await createdRoom.populate("ownersID");
    await createdRoom.populate("usersID");

    //add the room to the user
    owner.roomsID.push(createdRoom);
    await owner.save();

    return createdRoom;
}

export async function getRoom(query) {
    let rooms = await Room.find(query);
    if (!rooms) {
        return [false, "no rooms found"];
    }

    //populate messages and rooms
    for (const room of rooms) {
        await room.populate("messagesID");
        await room.populate("usersID");
        await room.populate("ownersID");
    }

    return rooms;
}

export async function addRoomUser(roomName, username) {
    await User.find({});
    let user = await User.findOne({ username });
    if (!user) {
        return [false, "user does not exists"];
    }

    let room = await Room.findOne({ name: roomName });
    if (!room) {
        return [false, "room does nost exists"];
    }

    //check if the user is in the room
    for (const roomUser of room.usersID) {
        if (roomUser.username === user.username) {
            return [false, "user already in room"];
        }
    }

    room.usersID.push(user);
    await room.save();

    //add the room to the user
    user.roomsID.push(room);
    await user.save();

    return room;
}

export async function addRoomOwner(roomName, ownerUsername) {
    let owner = await User.findOne({ username: ownerUsername });
    if (!owner) {
        return [false, "owner does not exists"];
    }

    let room = await Room.findOne({ name: roomName });
    if (!room) {
        return [false, "room does nost exists"];
    }
    //populate room with usersID and ownersID
    await room.populate("ownersID");
    await room.populate("usersID");

    //check if the user is in the room
    let isUserInRoom = false;
    for (const roomUser of room.usersID) {
        if (roomUser.username === owner.username) {
            isUserInRoom = true;
        }
    }

    if (!isUserInRoom) {
        return [false, "user not in room"];
    }

    //check if the user is already an owner of the room
    for (const roomOwner of room.ownersID) {
        if (roomOwner.username === owner.username) {
            return [false, "user already owner"];
        }
    }

    room.ownersID.push(owner);
    await room.save();
    return room;
}

export async function removeRoomUser(roomName, username) {
    let room = (await request.getRoom({ name: roomName }))[0];
    await room.populate("usersID");

    for (let index = 0; index < room.usersID.length; index++) {
        if (room.usersID[index].username === username) {
            room.usersID.splice(index, 1);
            return true;
        }
    }

    return [false, "user not in room"];
}

export async function DeleteRoom(query) {
    return (await Room.findOneAndDelete(query)) || false;
}

export async function updateRoom(query) {
    return (await Room.findOneAndUpdate(query)) || false;
}