import { Types } from 'mongoose';
import { Socket } from 'socket.io';


interface UserType{
  id: string
}


declare global {
  namespace Express {
    interface Request {
      user: UserType;
    }
  }
 
}