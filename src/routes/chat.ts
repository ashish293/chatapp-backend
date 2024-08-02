import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import { acceptRequest, getAllChat, getAllRequest, getMessages, sendMessageWithFile, sendRequest } from "../controllers/chat";
import { upload } from "../middlewares/multerStorage";

const chatRouter = Router();

chatRouter.use(isAuthenticated)
  .get('/all', getAllChat)
  .get('/messages/:chatId', getMessages)
  .post('/message/:chatId', upload.array('attachments'), sendMessageWithFile)
  .post('/sendRequest', sendRequest)
  .post('/acceptRequest', acceptRequest)
  .get('/getRequests', getAllRequest)


export default chatRouter