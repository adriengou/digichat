import {User} from "../mongodb/models/user_model.js";
import {Room} from "../mongodb/models/room_model.js";
import {Message} from "../mongodb/models/message_model.js";

export async function dropCollections(){
    try{
        await User.collection.drop()
        await Room.collection.drop()
        await Message.collection.drop()
    }catch (error){
        console.log("collection missing")
    }
}