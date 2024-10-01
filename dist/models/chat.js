import mongoose, { Schema, model } from 'mongoose';
// Define the Chat schema
const ChatSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        immutable: true
    },
    name: {
        type: String,
        required: true
    },
    isGroup: {
        type: Boolean,
        required: true,
        default: false
    },
    image: {
        type: String,
        default: ''
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message"
    },
});
// Export the Chat model
const Chat = mongoose.models.Chat || model("Chat", ChatSchema);
export default Chat;
