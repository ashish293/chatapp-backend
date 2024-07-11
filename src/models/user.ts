import mongoose, { Schema, model , Document, Types, Model} from "mongoose";

export interface IUser extends Document {
  id: string;
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  image?: string;
}


const UserSchema = new Schema<IUser>({
  id:{
    type:String,
    required:true,
    unique:true,
    immutable: true
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});


const User: Model<IUser> = mongoose.models.User|| model<IUser>("User", UserSchema);
export default User;