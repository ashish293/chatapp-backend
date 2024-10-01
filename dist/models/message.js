import mongoose, { Schema, model } from "mongoose";
const MessageSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        immutable: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
    },
    attachments: [String],
    chatId: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
const Message = mongoose.models.Message || model("Message", MessageSchema);
export default Message;
