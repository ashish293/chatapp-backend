import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { TryCatch } from "./error";
import { emitEvent, ErrorHandler } from "../utils/utility";
import { config } from "dotenv";
import { ExtendedError } from "socket.io/dist/namespace";
import { Socket } from "socket.io";
import User from "../models/user";
config();

type SocketAuthType = (socket:Socket, next:(err?:ExtendedError)=>void)=>void

interface JwtUserType extends JwtPayload {
  id:string
}


const isAuthenticated = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["chat-token"];
  if (!token) {
    return next(new ErrorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET!, (err: VerifyErrors | null, user:JwtPayload | string | undefined) => {
    if (err) {
      return next(new ErrorHandler(401, "Unauthorized"));
    }
    req.user = user as JwtUserType;
    next();
  });
})

const socketAuth:SocketAuthType = (socket, next)=>{
  console.log('h3');
  
  try {
    const token = socket.handshake.headers.authorization || socket.handshake.auth.token;
    if (!token) {
      return next(new ErrorHandler(401, "Unauthorized"));
    }
    jwt.verify(token, process.env.JWT_SECRET!, async (err: VerifyErrors | null, user:JwtPayload | string | undefined) => {
      if (err) {
        return next(new ErrorHandler(401, "Unauthorized"));
      }
      const { id } = user as JwtUserType;
      const currentUser = await User.findOne({id});
      if(!currentUser){
        return next(new ErrorHandler(401, "User not found"));
      }
      socket.data.user = currentUser;
      next();
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(401,"Please login to access this route"));
  }

  
}
export { isAuthenticated, socketAuth };