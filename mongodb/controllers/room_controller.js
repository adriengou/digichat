import {User} from "../models/user_model.js";
import {Room} from "../models/room_model.js";
import {Message} from "../models/message_model.js";

/**
 *
 * @param ownerUsername
 * @param roomName
 * @return {Promise<((Document<unknown, any, InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>>> & InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>> & {_id: Types.ObjectId} & ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TInstanceMethods">)|string)[]|(boolean|string)[]>}
 */
export async function addRoom(ownerUsername, roomName) {
    //check if a room already exists with the name
    if (await Room.findOne({name: roomName})) {
        return [false, "room name already used"];
    }

    //get the owner document
    let owner = await User.findOne({username: ownerUsername});
    if (!owner) {
        return [false, "owner does not exists"];
    }

    //create the room set the owner as room owner and user
    const createdRoom = await Room.create({
        name: roomName,
        ownersID: [owner],
        usersID: [owner],
    });

    //await createdRoom.populate("ownersID");
    //await createdRoom.populate("usersID");

    //add the room to the user
    owner.roomsID.push(createdRoom);
    await owner.save();

    return [createdRoom, ''];
}

/**
 *
 * @param username
 * @param roomName
 * @param isAdmin
 * @return {Promise<(boolean|string)[]|((Query<Document<unknown, any, InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>>> & InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>> & {_id: Types.ObjectId} & ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TInstanceMethods">, Document<unknown, any, InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>>> & InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>> & {_id: Types.ObjectId} & ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TInstanceMethods">, ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TQueryHelpers">, InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>>> & ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TQueryHelpers">)|string)[]>}
 */
export async function getRoomByName(username, roomName, isAdmin) {
    let room = await Room.findOne({name: roomName});
    if (!room) {
        return [false, "room not found"];
    }

    //populate messages and rooms
    if (isAdmin){
        await room.populate("messagesID");
        await room.populate("usersID");
        await room.populate("ownersID");
    }else{
        let user = await User.findOne({username});
        //console.log(user._id.toString())
        if (!user) {
            return [false, "user does not exists"];
        }

        //check if the user is in the room
        let isUserPresent = room.usersID.find(element => element._id.toString() === user._id.toString())
        if (!isUserPresent){
            return [false, 'user not in the room']
        }

        await room.populate("messagesID")
        await room.populate("usersID", "username firstName lastName avatar")
        await room.populate("ownersID", "username firstName lastName avatar")
    }

    return [room, ''];
}


/**
 *
 * @param ownerName
 * @param roomName
 * @param username
 * @return {Promise<(boolean|string)[]|((Query<Document<unknown, any, InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>>> & InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>> & {_id: Types.ObjectId} & ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TInstanceMethods">, Document<unknown, any, InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>>> & InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>> & {_id: Types.ObjectId} & ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TInstanceMethods">, ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TQueryHelpers">, InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>>> & ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TQueryHelpers">)|string)[]>}
 */
export async function addRoomUser(ownerName, roomName, username) {

    //check if the owner exists
    let owner = await User.findOne({username: ownerName});
    if (!owner) {
        return [false, "owner does not exists"];
    }

    //check if the user to be added exists
    let user = await User.findOne({username});
    if (!user) {
        return [false, "user does not exists"];
    }

    //check if the room exists
    let room = await Room.findOne({name: roomName});
    if (!room) {
        return [false, "room does not exists"];
    }

    //check if the owner is in the room as owner
    let isOwnerPresent = room.ownersID.find(element => element._id.toString() === owner._id.toString())
    if (!isOwnerPresent){
        return [false, 'owner not in the room']
    }

    //check if the user is in the room
    let isUserPresent = room.usersID.find(element => element._id === user._id)
    if (isUserPresent){
        return [false, 'user already in the room']
    }

    //add the user id to the room
    room.usersID.push(user);
    await room.save();

    //add the room to the user
    user.roomsID.push(room);
    await user.save();

    return [room, ''];
}


/**
 *
 * @param roomName
 * @param ownerUsername
 * @return {Promise<(Query<Document<unknown, any, InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>>> & InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>> & {_id: Types.ObjectId} & ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TInstanceMethods">, Document<unknown, any, InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>>> & InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>> & {_id: Types.ObjectId} & ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TInstanceMethods">, ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TQueryHelpers">, InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>>> & ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TQueryHelpers">)|(boolean|string)[]>}
 */
export async function addRoomOwner(roomName, ownerUsername) {
    let owner = await User.findOne({username: ownerUsername});
    if (!owner) {
        return [false, "owner does not exists"];
    }

    let room = await Room.findOne({name: roomName});
    if (!room) {
        return [false, "room does not exists"];
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

/**
 *
 * @param roomName
 * @param username
 * @return {Promise<boolean|(boolean|string)[]>}
 */
export async function removeRoomUser(ownerName, roomName, username) {
    let room = await Room.findOne({name: roomName})
    if(!room){
        return [false, "room does not exists"]
    }

    await room.populate("ownersID")
    await room.populate("usersID");

    let isOwner = room.ownersID.find(elem => elem.username === ownerName )
    if(!isOwner){
        return [false, 'not a owner of the room']
    }

    let isUser = room.usersID.find(elem => elem.username === username )
    if(!isUser){
        return [false, 'user not in the room']
    }

    room.usersID = room.usersID.filter(elem => elem.username !==username)

    let user = await User.findOne({username})
    await user.populate("roomsID")
    user.roomsID = user.roomsID.filter(elem => elem.name !== roomName)
    await user.save()

    await room.save()

    return [true, ''];
}


/**
 *
 * @param query
 * @return {Promise<(Query<Document<unknown, any, InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>>> & InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>> & {_id: Types.ObjectId} & ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TInstanceMethods">, Document<unknown, any, InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>>> & InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>> & {_id: Types.ObjectId} & ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TInstanceMethods">, ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TQueryHelpers">, InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>>> & ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TQueryHelpers">)|boolean>}
 */
export async function deleteRoom(ownerName, roomName) {
    let room = await Room.findOne({name: roomName})
    if(!room){
        return [false, "room does not exists"]
    }

    await room.populate("ownersID")

    let isOwner = room.ownersID.find(elem => elem.username === ownerName )
    if(!isOwner){
        return [false, 'not a owner of the room']
    }

    await Room.deleteOne(room);
    return [room, '']
}

/**
 *
 * @param query
 * @return {Promise<(Query<Document<unknown, any, InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>>> & InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>> & {_id: Types.ObjectId} & ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TInstanceMethods">, Document<unknown, any, InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>>> & InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>> & {_id: Types.ObjectId} & ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TInstanceMethods">, ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TQueryHelpers">, InferSchemaType<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>>> & ObtainSchemaGeneric<module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultTypeKey, {name: {unique: boolean, type: StringConstructor, required: boolean}, usersID: {ref: string, type: ObjectId[], required: boolean}, ownersID: {ref: string, type: ObjectId[], required: boolean}, messagesID: [{ref: string, type: ObjectId}]}>, "TQueryHelpers">)|boolean>}
 */
export async function updateRoom(query) {
    return (await Room.findOneAndUpdate(query)) || false;
}