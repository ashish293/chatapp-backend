import mongoose, { Schema, model, Types } from "mongoose";

const ChatSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  isGroup: {
    type: Boolean
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
})

const Chat = mongoose.models.Chat || model("Chat", ChatSchema);
export default Chat