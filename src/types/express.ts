import { Types } from 'mongoose';


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