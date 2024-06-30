import mongoose, { Schema, model, Types } from "mongoose";
const MessageSchema = new Schema({
  sender: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  // receiver: {
  //   type: Types.ObjectId,
  //   ref: "User",
  //   required: true
  // },
  content: {
    type: String,
  },
  attachments: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
  }],
  chatId: {
    type: Types.ObjectId,
    ref: "Chat",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
})

const Message = mongoose.models.Message || model("Message", MessageSchema);
export default Message