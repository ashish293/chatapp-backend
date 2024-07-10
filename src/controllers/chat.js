import { NEW_ATTACHMENT, NEW_MESSAGE_ALERT } from "../constant/event.js";
import { TryCatch } from "../middlewares/error.js";
import Chat from "../models/chat.js";
import Message from "../models/message.js";
import User from "../models/user.js";
import { ErrorHandler, emitEvent, sendSuccess } from "../utils/utility.js";

const getAllChat = TryCatch(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 20;
  const skip = (parseInt(req.query.page) - 1) * limit || 0;
  const chatList = (await Chat.find({ members: req.user ? _id }).select("-__v").lean()).splice(0, 1);

  const result = await Promise.all(chatList.map(async (item) => {
    if (item?.isGroup) {
      return item;
    } else {
      const user2Id = item.members.find((member) => member.toString() !== req.user ? _id.toString());
      const user2 = await User.findById(user2Id);
      item.name = user2.name;
      item.image = user2.image;
      delete item.members;
      console.log(item);
      return item
    }
  }))
  console.log(result);
  sendSuccess({ res, data: result });
});

const sendMessage = TryCatch(async (req, res, next) => {
  const { chatId } = req.params;
  const { message } = req.body;
  console.log(req.file);

  const [chat, user] = await Promise.all([Chat.findById(chatId), User.findById(req.user ? _id)]);
  if (!chat) {
    return next(new ErrorHandler(404, "Chat not found"));
  }
  if (!chat.members.includes(user._id)) {
    return next(new ErrorHandler(400, "User not in this Chat"));
  }

  const files = req.files || [];

  // Upload file here
  const attachments = [];

  const messageForRealtime = {
    content: message,
    attachments,
    sender: {
      _id: user._id,
      name: user.name,
    },
    chatId,
    time: new Date(),
  };
  const messageForDB = { content: message, attachments, sender: user._id, chatId };
  await Message.create(messageForDB);
  chat.update
  emitEvent(req, NEW_ATTACHMENT, chat.members, messageForRealtime);
  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, chatId);

  sendSuccess({ res, message: "Message sent Successfully" });
});

const getMessages = TryCatch(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 20;
  const skip = (parseInt(req.query.page) - 1) * limit || 0;
  const { chatId } = req.params;
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ErrorHandler(404, "Chat not found"));
  } else if (!chat.members.includes(req.user ? _id)) {
    return next(new ErrorHandler(400, "You are not in this Chat"));
  }
  const [messages, total] = await Promise.all([Message.find({ chatId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("sender", "name image")
    .lean(), Message.countDocuments({ chatId })]);
  const totalPages = Math.ceil(total / limit);
  sendSuccess({ res, data: { messages, totalPages, limit } });
});

export { getAllChat, sendMessage, getMessages };
