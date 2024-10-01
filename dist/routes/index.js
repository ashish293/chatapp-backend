import { Router } from "express";
import userRouter from "./user.js";
import chatRouter from "./chat.js";
import groupRouter from "./group.js";
const router = Router();
router.use('/user', userRouter)
    .use('/chat', chatRouter)
    .use('/group', groupRouter);
export default router;
