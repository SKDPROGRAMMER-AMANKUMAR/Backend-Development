import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST:${connectionInstance.connection.host}`) /*
         ${connectionInstance.connection.host}
         >> It dynamically inserts the host address of your MongoDB connection into the string.
         >> connectionInstance is the object returned by Mongoose when the connection is established.
         >> connectionInstance.connection.host accesses the host (like cluster0.mongodb.net).
        */
  } catch (error) {
    console.log("MONGODB connection FAILED", error);
    process.exit(1);
  }
};

export default connectDB;
