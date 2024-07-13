import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { TryCatch } from "./error";
import { ErrorHandler } from "../utils/utility";
import { config } from "dotenv";
config();


interface UserType extends JwtPayload {
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
    req.user = user as UserType;
    next();
  });
})

export { isAuthenticated };