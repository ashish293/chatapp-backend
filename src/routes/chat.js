import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getAllChat, getMessages, sendMessage } from "../controllers/chat.js";
import { multerAttachment } from "../middlewares/multer.js";

const chatRouter = Router();

chatRouter.use(isAuthenticated)
  .get('/all', getAllChat)
  .get('/messages/:chatId', getMessages)
  .post('/message/:chatId', multerAttachment, sendMessage)

export default chatRouter