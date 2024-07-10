import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';


interface UserType{
  _id: Types.ObjectId
}


declare global {
  namespace Express {
    interface Request {
      user: UserType;
    }
  }
}