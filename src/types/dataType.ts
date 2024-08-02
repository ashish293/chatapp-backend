import { Types } from 'mongoose';


interface UserType{
  id: string,
  _id: Types.ObjectId,
  name: string,
  email: string,
  image?: string
}


declare global {
  namespace Express {
    interface Request {
      user: UserType;
    }
  }
 
}

export {UserType}