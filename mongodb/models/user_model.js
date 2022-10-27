import mongoose from "mongoose";
const { Schema } = mongoose;
import * as customValidator from "../custom_validators.js"

//User
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
        unique: true,
    },

    email: {
        type: String,
        required: false,
        unique: true,
    },

    password: {
        type: String,
        required: false,
    },

    roomsID: [{ type: Schema.Types.ObjectId, ref: "Room" }],
    sentMessagesID: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    receivedMessagesID: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    isLoggedIn: {
        type: Boolean,
        default: false,
    },

    token:{
        type:String,
    },

    country:{
        type:String,
        required:false
    },

    city:{
        type:String,
        required:false
    },

    street:{
        type:String,
        required:false
    },

    zipCode:{
      type:String,
      required:false
    },

    phoneNumber:{
        type:String,
        required:false
    },

    dialCode:{
        type:String,
        required:false
    },

    firstName:{
        type:String,
        required:false
    },

    lastName:{
        type:String,
        required:false
    },

    skills:[
        {
            type:String,
        }
    ],

    role: {
        type:String,
        required:false,
        default: 'user'
    },

    avatar: {
        type:String,
    },

    dateOfBirth:{
        type:Date,
        required:false,
    },

    friendsID:[{ type: Schema.Types.ObjectId, ref: "User" }],

});
export const User = mongoose.model("User", userSchema);
