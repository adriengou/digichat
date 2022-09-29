import config from "../config.js";
import mongoose from "mongoose";
import mongoRequests from "./requests.js";

//connect to the database
try {
  await mongoose.connect(config.MONGO_URI);
  console.log("connected to mongo database");
} catch (error) {
  throw error;
}
export default {};
