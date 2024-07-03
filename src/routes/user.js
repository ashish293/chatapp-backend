import { Router } from "express";
import { findUser, logout, signin, signup, uploadPhoto, } from '../controllers/user.js';
// import { multerSingleImage } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";


const userRouter = Router();
userRouter
  .post('/signup', signup)
  .post('/signin', signin)
  .use(isAuthenticated)
  .post('/logout', logout)
  .get('/find', findUser)
  .post('/uploadPhoto', uploadPhoto)

export default userRouter;