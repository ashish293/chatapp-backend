import mongoose, { Schema, model, Types, Model, Document} from "mongoose";


interface IMessage extends Document {
  _id: Types.ObjectId;
  id: string;
  sender: Types.ObjectId;
  content: string;
  attachments: string[];
  chatId: Types.ObjectId;
  createdAt: Date;
}



const MessageSchema = new Schema<IMessage>({
  id:{
    type:String,
    required:true,
    unique:true,
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
})

const Message:Model<IMessage> = mongoose.models.Message || model<IMessage>("Message", MessageSchema);
export default Message