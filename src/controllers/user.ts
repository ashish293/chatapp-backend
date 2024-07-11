import { TryCatch } from "../middlewares/error";
import User,{ IUser } from "../models/user";
import bcrypt from 'bcrypt';
import { ErrorHandler, sendToken } from "../utils/utility";

const signup = TryCatch(async (req, res, next) => {
  const { name, password, email } = req.body;
  if (!name || !password || !email) {
    return next(new ErrorHandler(400, 'name password and email are required'))
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler(400, 'User already exists'))
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashPassword });
  await newUser.save();
  sendToken(res, { id: newUser.id, name: newUser.name }, 201, 'User created successfully');
})

const login = TryCatch(async (req, res, next) => {
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
  sendToken(res, { id: existingUser.id, name: existingUser.name }, 200, 'Login successful');
})

const logout = TryCatch(async (req, res, next) => {
  res.clearCookie('chat-token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
})

const findUser = TryCatch(async (req, res, next) => {
  const { name } = req.query;
  const userList = await User.find({ name: { $regex: name, $options: 'i' } });
  if (!userList) {
    return next(new ErrorHandler(404, 'User not found'))
  }
  res.status(200).json(userList.map((user) => ({ name: user.name, email: user.email, _id: user.id })));
})

const update = TryCatch(async (req, res, next) => {
  const { name, email, password, image } = req.body;
  const user = await User.findById(req.user.id);
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
  res.status(200).json({ message: 'Photo uploaded successfully' });
})

export { signup, login, findUser, update, logout };
