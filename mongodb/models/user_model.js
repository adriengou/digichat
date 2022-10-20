import mongoose from "mongoose";
const { Schema } = mongoose;

//User
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    roomsID: [{ type: Schema.Types.ObjectId, ref: "Room" }],
    messagesID: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    isLoggedIn: {
        type: Boolean,
        default: false,
    },

    token:{
        type:String,
    }
});
export const User = mongoose.model("User", userSchema);