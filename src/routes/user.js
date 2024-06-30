import { Router } from "express";
import { findUser, signin, signup, uploadPhoto, } from '../controllers/user.js';
// import { multerSingleImage } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";


const userRouter = Router();
userRouter
  .post('/signup', signup)
  .post('/signin', signin)
  .use(isAuthenticated)
  .get('/find', findUser)
  .post('/uploadPhoto', uploadPhoto)

export default userRouter;