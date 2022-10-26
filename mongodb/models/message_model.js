import mongoose from "mongoose";
const { Schema } = mongoose;

//Message
const messageSchema = new mongoose.Schema({
    userID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },

    roomID: {
        type: Schema.Types.ObjectId,
        ref: "Room",
    },

    friendID:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    date: {
        type: Date,
        required: true,
    },

    content: {
        type: String,
        required: true,
    },
});
export const Message = mongoose.model("Message", messageSchema);
