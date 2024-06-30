import { TryCatch } from "../middlewares/error.js";
import User from "../models/user.js";
import bcrypt from 'bcrypt';
import { ErrorHandler, sendToken } from "../utils/utility.js";

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
  sendToken(res, { _id: newUser._id, name: newUser.name }, 201, 'User created successfully');
})

const signin = TryCatch(async (req, res, next) => {
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
  sendToken(res, { _id: existingUser._id, name: existingUser.name }, 200, 'Login successful');
})

const findUser = TryCatch(async (req, res, next) => {
  const { name } = req.query;
  const userList = await User.find({ name: { $regex: name, $options: 'i' } });
  if (!userList) {
    return next(new ErrorHandler(404, 'User not found'))
  }
  res.status(200).json(userList.map((user) => ({ name: user.name, email: user.email, _id: user._id })));
})

const uploadPhoto = TryCatch(async (req, res, next) => {

  res.status(200).json({ message: 'Photo uploaded successfully' });
})

export { signup, signin, findUser, uploadPhoto };
