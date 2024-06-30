import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getAllChat, getMessages, sendMessage } from "../controllers/chat.js";
import { upload } from "../middlewares/multerStorage.js";

const chatRouter = Router();

chatRouter.use(isAuthenticated)
  .get('/all', getAllChat)
  .get('/messages/:chatId', getMessages)
  .post('/message/:chatId', upload.single("file"), sendMessage)

export default chatRouter