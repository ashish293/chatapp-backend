import { Router } from "express";
import userRouter from "./user";
import chatRouter from "./chat";
import groupRouter from "./group";
const router = Router();


router.use('/user', userRouter)
  .use('/chat', chatRouter)
  .use('/group', groupRouter)

export default router;