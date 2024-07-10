import mongoose, { Schema, model, Types } from "mongoose";

const ChatSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  isGroup: {
    type: Boolean
  },
  image: {
    type: String
  },
  creator: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  members: {
    type: [Types.ObjectId],
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastMessage: {
    type: Types.ObjectId,
    ref: "Message"
  }
})

const Chat = mongoose.models.Chat || model("Chat", ChatSchema);
export default Chat