import mongoose from 'mongoose';
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'chat-app' });
        console.log("MongoDB connected");
    }
    catch (error) {
        console.log(error);
    }
};
export { connectDb };
