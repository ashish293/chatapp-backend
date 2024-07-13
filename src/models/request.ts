import mongoose, { Schema, model, Types, Model } from "mongoose";

interface IRequest extends Document {
  _id: Types.ObjectId;
  id: string;
  status: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  createdAt: Date;
}

const schema = new Schema<IRequest>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Request: Model<IRequest> = mongoose.models.Request || model<IRequest>("Request", schema);
export default Request;
