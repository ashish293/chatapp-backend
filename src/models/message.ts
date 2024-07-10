import mongoose, { Schema, model, Types, Model, Document} from "mongoose";


interface IMessage extends Document {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  attachments: string[];
  chatId: Types.ObjectId;
  createdAt: Date;
}



const MessageSchema = new Schema<IMessage>({
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
})

const Message:Model<IMessage> = mongoose.models.Message || model<IMessage>("Message", MessageSchema);
export default Message