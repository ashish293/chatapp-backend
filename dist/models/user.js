import mongoose, { Schema, model } from "mongoose";
const UserSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
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
const User = mongoose.models.User || model("User", UserSchema);
export default User;
