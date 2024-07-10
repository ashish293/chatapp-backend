import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import { getAllChat, getMessages, sendMessage } from "../controllers/chat";
import { upload } from "../middlewares/multerStorage";

const chatRouter = Router();

chatRouter.use(isAuthenticated)
  .get('/all', getAllChat)
  .get('/messages/:chatId', getMessages)
  .post('/message/:chatId', upload.single("file"), sendMessage)

export default chatRouter