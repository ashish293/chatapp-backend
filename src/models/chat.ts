import mongoose, { Schema, model, Document, Types, Model } from 'mongoose';

// Define the interface for the Chat document
export interface IChat extends Document {
  _id: Types.ObjectId;
  name: string;
  isGroup: boolean;
  image?: string;
  creator: Types.ObjectId;
  members: Types.ObjectId[];
  createdAt: Date;
  lastMessage?: Types.ObjectId;
}

// Define the Chat schema
const ChatSchema = new Schema<IChat>({
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
  }
});

// Export the Chat model
const Chat:Model<IChat> = mongoose.models.Chat || model<IChat>("Chat", ChatSchema);
export default Chat;
