import mongoose from "mongoose";

const { Schema } = mongoose;

//validation functions
async function validateEmail(email) {
  if (!isEmail(email)) {
    throw new Error("invalid email");
  }
  const user = await this.constructor.findOne({ email });
  if (user) {
    throw new Error("email already used");
  }
}

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
});
const User = mongoose.model("User", userSchema);

//Message
const messageSchema = new mongoose.Schema({
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  roomID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Room",
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
    unique: true,
  },

  ownersID: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "User",
  },

  usersID: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "User",
  },

  messagesID: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});
const Room = mongoose.model("Room", roomSchema);

export default { User, Message, Room };
