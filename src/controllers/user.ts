import { TryCatch } from "../middlewares/error.js";
import User from "../models/user.js";
import bcrypt from 'bcrypt';
import { ErrorHandler, sendSuccess, sendToken } from "../utils/utility.js";
import {v4 as uuid} from 'uuid';


interface MulterRequest extends Request {
  file: any;
}
const signup = TryCatch(async (req, res, next) => {
  const { name, password, email } = req.body;
  if (!name || !password || !email) {
    return next(new ErrorHandler(400, 'name password and email are required'))
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler(400, 'User already exists with this email'))
  }
  const url = (req.file as any)?.location;
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser =  await User.create({ id: uuid(), name, email, password: hashPassword, image: url });
  sendToken(res, { id: newUser.id, name: newUser.name, image: newUser.image, email: newUser.email }, 201, 'User created successfully');
})

const login = TryCatch(async (req, res, next) => {
  console.log('loginss');
  
  const { password, email } = req.body;
  if (!password || !email) {
    return next(new ErrorHandler(400, 'All fields are required'))
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return next(new ErrorHandler(404, 'User not found'))
  }
  const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordCorrect) {
    return next(new ErrorHandler(400, 'Invalid credentials'))
  }
  sendToken(res, { id: existingUser.id, name: existingUser.name, image: existingUser.image, email: existingUser.email }, 200, 'Login successful');
})

const logout = TryCatch(async (req, res, next) => {
  res.clearCookie('chat-token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
})

const findUser = TryCatch(async (req, res, next) => {
  const { name, email } = req.query;

  let userList;
  if(email){
    userList = await User.find({ email }).select("name email image id -_id");
  }else{
    userList = await User.find({ name: { $regex: name, $options: 'i' } }).select("name email image id -_id");
  }
  if (!userList) {
    return next(new ErrorHandler(404, 'User not found'))
  }
  sendSuccess({ res, data: userList })
})

const update = TryCatch(async (req, res, next) => {
  console.log(req.file);
  
  const { name, email, password, image } = req.body;
  const user = await User.findOne({id:req.user.id});
  if (!user) {
    return next(new ErrorHandler(404, 'User not found'))
  }
  const hashPassword = await bcrypt.hash(password, 10);
  user.name = name;
  user.email = email;
  user.password = password;
  user.image = image;
  console.log(name, email, hashPassword, image);
  // console.log(req.file);
  sendToken(res, { id: user.id, name: user.name, image: user.image, email: user.email }, 200, 'User updated successfully');
})

export { signup, login, findUser, update, logout };
