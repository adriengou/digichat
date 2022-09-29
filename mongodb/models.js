import mongoose from "mongoose";
import { isEmail } from "validator";

const { Schema } = mongoose;

//User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    validate: [isEmail, "invalid email"],
  },

  password: {
    type: String,
    required: true,
  },

  roomsID: [Schema.Types.ObjectId],
  messagesID: [Schema.Types.ObjectId],
});
const User = mongoose.model("User", userSchema);

//Message
const messageSchema = new mongoose.Schema({
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  roomID: {
    type: Schema.Types.ObjectId,
    required: true,
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
const Message = mongoose.model("Message", messageSchema);

//Room
const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  ownersID: {
    type: [Schema.Types.ObjectId],
    required: true,
  },

  usersID: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
});
const Room = mongoose.model("Room", roomSchema);

export default { User, Message, Room };
