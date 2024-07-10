import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Document, ObjectId, Types } from 'mongoose';

interface UserType {
  _id: Types.ObjectId;
  name: string;
}

class ErrorHandler extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

const sendToken = (res: Response, user: UserType, code: number, message: string) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!);
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true, // set to true to prevent client-side access to the cookie
    secure: process.env.NODE_ENV === 'production' // use secure cookies in production
  };
  res.status(code).cookie(process.env.JWT_COOKIE_NAME!, token, options).json({
    success: true,
    user,
    token,
    message
  });
}

interface SendSuccessParams {
  res: Response;
  status?: number;
  message?: string;
  data?: any;
}

const sendSuccess = ({ res, status = 200, message, data }: SendSuccessParams) => {
  const response: { success: boolean; data?: any; message?: string } = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
}

const emitEvent = (data: any) => {
  console.log("Event emitted", data);
}

export { ErrorHandler, sendToken, emitEvent, sendSuccess };
