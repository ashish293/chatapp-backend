import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { TryCatch } from "./error.js";
import { emitEvent, ErrorHandler } from "../utils/utility.js";
import { config } from "dotenv";
import { Socket } from "socket.io";
import User from "../models/user.js";
import { UserType } from "../types/dataType.js";
config();

type SocketAuthType = (socket:Socket, next:(err?:any)=>void)=>void

interface JwtUserType extends JwtPayload {
  id:string
}

const getUser = async(token:string, next:(err?:any)=>void|NextFunction)=>{
  if (!token) {
    return next(new ErrorHandler(401, "Unauthorized"));
  }
  const {id} = jwt.verify(token, process.env.JWT_SECRET!) as JwtUserType;
  const user = await User.findOne({id});
  if(!user){
    return next(new ErrorHandler(401, "User not found"));
  }
  return user;
}


const isAuthenticated = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["chat-token"];
  const user = await getUser(token, next);
  req.user = user as UserType;
  next();
})

const socketAuth:SocketAuthType = (socket, next)=>{
  try {
    const token = socket.handshake.headers.authorization || socket.handshake.auth.token;
    const user = getUser(token, next);
    socket.data.user = user;
    next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(401,"Please login to access this route"));
  }

  
}
export { isAuthenticated, socketAuth };