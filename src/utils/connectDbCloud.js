import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

const connectDb = async () => {
  try {
    console.log("MongoDB connecting...", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'chat-app' });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
}

const configCloud = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}


export { connectDb, configCloud };