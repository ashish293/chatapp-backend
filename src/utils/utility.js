import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: false,
    secure: true
  };
  res.status(code).cookie("chat-token", token, options).json({
    success: true,
    user,
    token,
    message
  });
}
const sendSuccess = ({ res, status, message, data }) => {
  const response = { success: true }
  if (data) response.data = data
  if (message) response.message = message
  res.status(status || 200).json(response);
}

const emitEvent = (data) => {
  console.log("Event emitted");
}

export { ErrorHandler, sendToken, emitEvent, sendSuccess };