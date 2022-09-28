import mongoose from "mongoose";
const { Schema } = mongoose;

//User
const userSchema = new mongoose.Schema({
  pseudo: String,
});
const User = mongoose.model("User", userSchema);

//Message
const messageSchema = new mongoose.Schema({
  name: String,
});
const Message = mongoose.model("Message", messageSchema);

//Room
const roomSchema = new mongoose.Schema({
  name: String,
});
const Room = mongoose.model("Room", roomSchema);

// //User_Message
// const kittySchema = new mongoose.Schema({
//   name: String,
// });
// const Kitten = mongoose.model("Kitten", kittySchema);

//User_join_Room
const userJoinRoomSchema = new mongoose.Schema({
  name: String,
});
const UserJoinRoom = mongoose.model("Kitten", userJoinRoomSchema);

// //User_create_Room
// const userCreateRoomSchema = new mongoose.Schema({
//   name: String,
// });
// const UserCreateRoom = mongoose.model("Kitten", userCreateRoomSchema);

// //Message_belongs_Room
// const messageBelongsRoomSchema = new mongoose.Schema({
//   name: String,
// });
// const MessageBelongsRoom = mongoose.model("MessageBelongsRoom", messageBelongsRoomSchema);
