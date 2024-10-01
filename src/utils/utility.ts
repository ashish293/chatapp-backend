import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Document, ObjectId, Types } from 'mongoose';

interface UserType {
  id: string;
  name: string;
  email: string;
  image?: string;
}

class ErrorHandler extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

const sendToken = (res: Response, user: UserType, code: number, message: string) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true, // set to true to prevent client-side access to the cookie
    secure: true, // use secure cookies in production
    sameSite: 'none' as const
  };
  res.status(code).cookie(process.env.JWT_COOKIE_NAME!, token, options).json({
    success: true,
    user,
    token,
    message
  });
}


interface SendType {
  data?: any;
  message?: string;
  pageNumber?: number;
  pageSize?: number; 
  totalPages?: number;
}
interface SendSuccessParams extends SendType {
  res: Response;
  status?: number;
}

interface ResponseType extends SendType {
  success: boolean;
}

const sendSuccess = ({ res, status = 200, ...keys }: SendSuccessParams) => {
  const response:ResponseType = { success: true };
  Object.entries(keys).forEach(([key, value]) => {
    if (value) response[key as keyof ResponseType] = value;
  })
  
  res.status(status).json(response);
}

const emitEvent = (event: string, to: string, data: any) => {
  console.log("Event emitted", data);
}

export { ErrorHandler, sendToken, emitEvent, sendSuccess };
