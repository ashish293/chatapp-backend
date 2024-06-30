import jwt from "jsonwebtoken";
import { TryCatch } from "./error.js";
import { ErrorHandler } from "../utils/utility.js";
import { config } from "dotenv";
config();

const isAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.cookies["chat-token"];
  if (!token) {
    return next(new ErrorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(new ErrorHandler(401, "Unauthorized"));
    }
    req.user = user;
    next();
  });
})

export { isAuthenticated };