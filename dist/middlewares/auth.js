import jwt from "jsonwebtoken";
import { TryCatch } from "./error.js";
import { ErrorHandler } from "../utils/utility.js";
import { config } from "dotenv";
import User from "../models/user.js";
config();
const getUser = async (token, next) => {
    if (!token) {
        return next(new ErrorHandler(401, "Unauthorized"));
    }
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ id });
    if (!user) {
        return next(new ErrorHandler(401, "User not found"));
    }
    return user;
};
const isAuthenticated = TryCatch(async (req, res, next) => {
    const token = req.cookies["chat-token"];
    const user = await getUser(token, next);
    req.user = user;
    next();
});
const socketAuth = (socket, next) => {
    try {
        const token = socket.handshake.headers.authorization || socket.handshake.auth.token;
        const user = getUser(token, next);
        socket.data.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler(401, "Please login to access this route"));
    }
};
export { isAuthenticated, socketAuth };
