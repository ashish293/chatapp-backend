import mongoose, { Schema, model } from "mongoose";
const schema = new Schema({
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
}, {
    timestamps: true,
});
const Request = mongoose.models.Request || model("Request", schema);
export default Request;
