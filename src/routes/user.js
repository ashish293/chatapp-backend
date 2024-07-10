import { Router } from "express";
import { findUser, logout, login, signup, update, } from '../controllers/user.js';
// import { multerSingleImage } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { upload } from "../middlewares/multerStorage.js";


const userRouter = Router();
userRouter
  .post('/signup', upload.single('image'), signup)
  .post('/login', login)
  .use(isAuthenticated)
  .post('/logout', logout)
  .get('/find', findUser)
  .post('/update', upload.single('image'), update)

export default userRouter;