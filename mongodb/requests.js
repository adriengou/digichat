//create a document
import models from "./models.js";
import mongoose from "mongoose";
import validator from "validator";
const { ObjectId } = mongoose.Types;
const { isEmail } = validator;
const { User, Message, Room } = models;

const request = {};

function missingParameters(params) {
  //check if a parameter is missing
  for (const key in params) {
    if (!params[key]) {
      return [true, key];
    }
  }

  return [false, ""];
}

// USER--------------------------------------------------------------------------
request.addUser = async function (username, email, password) {
  //validate mail
  if (!isEmail(email)) {
    [false, "invalid email"];
  }

  //check if the email is already used
  let user = await User.findOne({ email });
  if (user) {
    return [false, "email already used"];
  }

  //check if user is already used
  user = await User.findOne({ username });
  if (user) {
    return [false, "username already used"];
  }

  let [missing, param] = missingParameters({ username, email, password });
  if (missing) {
    return [false, `${param} parameter missing`];
  }

  return await User.create({ username, email, password });
};

request.getUser = async function (query) {
  let users = await User.find({});
  if (!users) {
    return [false, "no users found"];
  }

  //populate messages and rooms
  for (const user of users) {
    await user.populate("messagesID");
    await user.populate("roomsID");
  }

  return users;
};

request.deleteUser = async function (query) {
  return (await User.findOneAndDelete(query)) || false;
};

request.updateUser = async function (query) {
  return (await User.findOneAndUpdate(query)) || false;
};

// ROOMS-------------------------------------------------------------------
request.addRoom = async function (ownerUsername, roomName) {
  //check if a room already exists withe the name
  if (await Room.findOne({ name: roomName })) {
    return [false, "room name already used"];
  }

  //get the owner document
  let owner = await User.findOne({ username: ownerUsername });
  if (!owner) {
    return [false, "owner does not exists"];
  }

  //create the room set the owner as room owner and user

  const createdRoom = await Room.create({
    name: roomName,
    ownersID: [owner],
    usersID: [owner],
  });

  await createdRoom.populate("ownersID");
  await createdRoom.populate("usersID");

  //add the room to the user
  owner.roomsID.push(createdRoom);
  await owner.save();

  return createdRoom;
};

request.getRoom = async function (query) {
  let rooms = await Room.find(query);
  if (!rooms) {
    return [false, "no rooms found"];
  }

  //populate messages and rooms
  for (const room of rooms) {
    await room.populate("messagesID");
    await room.populate("usersID");
    await room.populate("ownersID");
  }

  return rooms;
};

request.addRoomUser = async function (roomName, username) {
  await User.find({});
  let user = await User.findOne({ username });
  if (!user) {
    return [false, "user does not exists"];
  }

  let room = await Room.findOne({ name: roomName });
  if (!room) {
    return [false, "room does nost exists"];
  }

  //check if the user is in the room
  for (const roomUser of room.usersID) {
    if (roomUser.username === user.username) {
      return [false, "user already in room"];
    }
  }

  room.usersID.push(user);
  await room.save();

  //add the room to the user
  user.roomsID.push(room);
  await user.save();

  return room;
};

request.addRoomOwner = async function (roomName, ownerUsername) {
  let owner = await User.findOne({ username: ownerUsername });
  if (!owner) {
    return [false, "owner does not exists"];
  }

  let room = await Room.findOne({ name: roomName });
  if (!room) {
    return [false, "room does nost exists"];
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
};

request.removeRoomUser = async function (roomName, username) {
  let room = (await request.getRoom({ name: roomName }))[0];
  await room.populate("usersID");

  for (let index = 0; index < room.usersID.length; index++) {
    if (room.usersID[index].username === username) {
      room.usersID.splice(index, 1);
      return true;
    }
  }

  return [false, "user not in room"];
};

request.deleteRoom = async function (query) {
  return (await Room.findOneAndDelete(query)) || false;
};

request.updateRoom = async function (query) {
  return (await Room.findOneAndUpdate(query)) || false;
};

// Messages----------------------------------------------------------------
request.addMessage = async function (username, roomName, date, content) {
  // get user
  let user = await User.findOne({ username });

  // get room
  let room = await Room.findOne({ name: roomName });

  let createdMessage = await Message.create({
    userID: user,
    roomID: room,
    date: date,
    content: content,
  });

  await createdMessage.populate("userID");
  await createdMessage.populate("roomID");

  user.messagesID.push(createdMessage);
  await user.save();

  room.messagesID.push(createdMessage);
  await room.save();

  return createdMessage;
};

request.getMessage = async function (query) {
  let messages = await Message.find(query);
  if (!messages) {
    return [false, "no messages found"];
  }

  //populate users and rooms
  for (const message of messages) {
    await message.populate("userID");
    await message.populate("roomID");
  }
  return messages;
};

request.deleteMessage = async function (query) {
  return (await Message.findOneAndDelete(query)) || false;
};

request.updateMessage = async function (query) {
  return (await Message.findOneAndUpdate(query)) || false;
};

setTimeout(async function () {
  await User.collection.drop();
  await Room.collection.drop();
  await Message.collection.drop();

  //create users
  await request.addUser("User1", "user1@gmail.com", "seolhjeoguhqzeo");
  await request.addUser("User2", "user2@gmail.com", "seolhjeoguhqzeo");

  //create room
  await request.addRoom("User1", "room1");

  //add User2 to the room
  await request.addRoomUser("room1", "User2");

  //set User2 as owner
  await request.addRoomOwner("room1", "User2");

  //make User1 write a message at date now
  const today = new Date();
  await request.addMessage("User1", "room1", today, "Le premier message");

  let room1 = (await request.getRoom({}))[0];
  console.log(room1);
}, 0);

export default {};
