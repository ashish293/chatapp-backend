// import { NEW_ATTACHMENT, NEW_MESSAGE_ALERT } from "../constant/event";
import { TryCatch } from "../middlewares/error";
import Chat from "../models/chat";
import Message from "../models/message";
import Request from "../models/request";
import User from "../models/user";
import { ErrorHandler, emitEvent, sendSuccess } from "../utils/utility";
import { v4 as uuid } from 'uuid';


const getAllChat = TryCatch(async (req, res, next) => {
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const skip = (parseInt(req.query.page as string) - 1) * pageSize || 0;
  const user = await User.findOne({ id: req.user.id });
  if(!user){
    return next(new ErrorHandler(404, "User not found"));
  }
  const chatList = (await Chat.find({ members: user._id }).select("-__v").lean()).splice(0, 1);

  const result = await Promise.all(chatList.map(async (item) => {
    if (item?.isGroup) {
      return item;
    } else {
      const user2Id = item.members.find((member) => member.toString() !== req.user.id.toString());
      const user2 = await User.findOne({id: user2Id});
      if(!user2) return
      item.name = user2.name;
      item.image = user2.image;
      item.members= [];
      return item
    }
  }))

  sendSuccess({ res, data: result });
});

const sendMessage = TryCatch(async (req, res, next) => {
  const { chatId } = req.params;
  const { message } = req.body;

  const [chat, user] = await Promise.all([Chat.findOne({id:chatId}), User.findOne({id:req.user.id})]);
  if (!chat) {
    return next(new ErrorHandler(404, "Chat not found"));
  }else if(!user){
    return next(new ErrorHandler(404, "User not found"));
  }else if (!chat.members.includes(user.id)) {
    return next(new ErrorHandler(400, "User not in this Chat"));
  }
  // const files = req.files || [];

  // Upload file here
  const attachments:string[] = [];
  const msgId = uuid()
  const messageForRealtime = {
    id: msgId,
    content: message,
    attachments,
    sender: {
      id: user.id,
      name: user.name,
    },
    chatId,
    time: new Date(),
  };
  const messageForDB = { id: msgId, content: message, attachments, sender: user.id, chatId };
  const newMessage = await Message.create(messageForDB);
  chat.lastMessage = newMessage._id;
  await chat.save();
  // chat.update
  // emitEvent(req, NEW_ATTACHMENT, chat.members, messageForRealtime);
  // emitEvent(req, NEW_MESSAGE_ALERT, chat.members, chatId);

  sendSuccess({ res, message: "Message sent Successfully" });
});

const getMessages = TryCatch(async (req, res, next) => {
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const skip = (parseInt(req.query.page as string) - 1) * pageSize || 0;
  const { chatId } = req.params;
  const chat = await Chat.findOne({id:chatId});
  if (!chat) {
    return next(new ErrorHandler(404, "Chat not found"));
  } 
  const user = await User.findOne({id:req.user.id});
  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }
  if (!chat.members.includes(user?._id)) {
    return next(new ErrorHandler(400, "You are not in this Chat"));
  }
  const [messages, total] = await Promise.all([Message.find({ chatId })
    .select("-__v")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .populate("sender", "name image")
    .lean(), Message.countDocuments({ chatId })]);
  const totalPages = Math.ceil(total / pageSize);
  sendSuccess({ res, data: { messages, totalPages, pageSize, page: parseInt(req.query.page as string) } });
});

const sendRequest = TryCatch(async (req, res, next) => {
  const target = req.body.userid;
  if(!target){
    return next(new ErrorHandler(400, "userid is required"));
  }
  const [user, user2] = await Promise.all([User.findOne({id:req.user.id}), User.findOne({id:target})]);

  if(!user || !user2){
    return next(new ErrorHandler(404, "User not found"));
  }
  await Request.create({
    id:uuid(),
    status:'pending',
    sender:user._id,
    receiver:user2._id,
  })
  sendSuccess({ res, message: "Chat requested successfully" });
})

const acceptRequest = TryCatch(async (req, res, next) => {
  const requestId = req.body.requestId;
  if(!requestId){
    return next(new ErrorHandler(400, "requestId is required"));
  }
  const request = await Request.findOne({id:requestId});
  if(!request){
    return next(new ErrorHandler(404, "Request not found"));
  }
  const [user, user2] = await Promise.all([User.findOne({id:req.user.id}), User.findOne({id:request.sender})]);
  console.log(user, user2);
  

  if(!user || !user2){
    return next(new ErrorHandler(404, "User not found"));
  }
  const chat = await Chat.create({
    id:uuid(),
    isGroup:false,
    name:"Direct",
    members:[user._id, user2._id],
    creator:user._id
  })
  await Request.updateOne({sender:user._id, receiver:user2._id}, {status:'accepted'})
  sendSuccess({ res, message: "Chat accepted successfully" });
})

const getAllRequest = TryCatch(async (req, res, next) => {
  const user = await User.findOne({id:req.user.id});
  if(!user){
    return next(new ErrorHandler(404, "User not found"));
  }
  const requests = await Request.find({receiver:user._id, status:'pending'}).select("id status sender -_id").populate("sender", "name email image -_id");
  sendSuccess({ res, data: requests });
})

export { getAllChat, sendMessage, getMessages, sendRequest, acceptRequest, getAllRequest };
