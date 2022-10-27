import mongoose from "mongoose";
const { Schema } = mongoose;
import * as customValidator from "../custom_validators.js"

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
        required:true
    },

    city:{
        type:String,
        required:true
    },

    street:{
        type:String,
        required:true
    },

    zipCode:{
      type:String,
      required:true
    },

    phoneNumber:{
        type:String,
        required:true
    },

    dialCode:{
        type:String,
        required:true
    },

    firstName:{
        type:String,
        required:true
    },

    lastName:{
        type:String,
        required:true
    },

    skills:[
        {
            type:String,
        }
    ],

    role: {
        type:String,
        required:true,
        default: 'user'
    },

    avatar: {
        type:String,
    },

    dateOfBirth:{
        type:Date,
        required:true,
    },

    friendsID:[{ type: Schema.Types.ObjectId, ref: "User" }],

});
export const User = mongoose.model("User", userSchema);
