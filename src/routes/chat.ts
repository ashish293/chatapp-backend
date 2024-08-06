import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { acceptRequest, getAllChat, getAllRequest, getMessages, sendMessageWithFile, sendRequest } from "../controllers/chat.js";
import { upload } from "../middlewares/multerStorage.js";

const chatRouter = Router();

chatRouter.use(isAuthenticated)
  .get('/all', getAllChat)
  .get('/messages/:chatId', getMessages)
  .post('/message/:chatId', upload.array('attachments'), sendMessageWithFile)
  .post('/sendRequest', sendRequest)
  .post('/acceptRequest', acceptRequest)
  .get('/getRequests', getAllRequest)


export default chatRouter