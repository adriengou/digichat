import mongoose from "mongoose";
const { Schema } = mongoose;

//Room
const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    ownersID: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }],

    usersID: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }],

    messagesID: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

export const Room = mongoose.model("Room", roomSchema);