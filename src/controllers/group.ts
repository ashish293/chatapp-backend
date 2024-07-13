// import { ALERT, REFREST_CHAT } from "../constant/event";
import { TryCatch } from "../middlewares/error";
import Chat from "../models/chat";
import Message from "../models/message";
import User from "../models/user";
import { ErrorHandler, emitEvent, sendSuccess } from "../utils/utility";

const newGroup = TryCatch(async (req, res, next) => {

  const { members, name } = req.body;
  if (!name) {
    return next(new ErrorHandler(400, 'Group name is required'))
  } else if (members.length < 1) {
    return next(new ErrorHandler(400, 'Select at least one member'))
  }
  const allMembers = [req.user.id, ...members];
  await Chat.create({ name, members: allMembers, creator: req.user.id, isGroup: true });
  // emitEvent(REFREST_CHAT, allMembers);
  // emitEvent(ALERT, members);
  sendSuccess({ res, message: 'Group created successfully', status: 201 });
})

const getMyGroup = TryCatch(async (req, res, next) => {
  const chatList = await Chat.find({ creator: req.user.id, isGroup: true }).populate("members", "name email image");
  sendSuccess({ res, data: chatList });
})

const addMember = TryCatch(async (req, res, next) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    return next(new ErrorHandler(400, 'chatId and userId are required'))
  }
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ErrorHandler(404, 'Chat not found'))
  }
  if (!chat.isGroup) {
    return next(new ErrorHandler(400, 'This is not a group chat'))
  }
  console.log(chat.creator, req.user.id);
  if (chat.creator.toString() !== req.user.id.toString()) {
    return next(new ErrorHandler(400, 'Only group Admin can add members'))
  }
  if (chat.members.includes(userId)) {
    return next(new ErrorHandler(400, 'User already in the group'))
  }
  chat.members.push(userId);
  await chat.save();
  // emitEvent(REFREST_CHAT, chat.members);
  sendSuccess({ res, message: 'Member added successfully' });
})

const removeMember = TryCatch(async (req, res, next) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    return next(new ErrorHandler(400, 'chatId and userId are required'))
  }
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ErrorHandler(404, 'Chat not found'))
  }
  if (!chat.members.includes(userId)) {
    return next(new ErrorHandler(400, 'User not in the group'))
  }
  const index = chat.members.indexOf(userId);
  chat.members.splice(index, 1);
  await chat.save();
  // emitEvent(REFREST_CHAT, chat.members);
  sendSuccess({ res, message: 'Member removed successfully' });
})

const leaveGroup = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  if (!chatId) {
    return next(new ErrorHandler(400, 'chatId is required'))
  }
  const chat = await Chat.findOne({id:chatId});
  if (!chat) {
    return next(new ErrorHandler(404, 'Chat not found'))
  }
  const user = await User.findOne({id:req.user.id});
  if (!user || !chat.members.includes(user?._id)) {
    return next(new ErrorHandler(400, 'User not in the group'))
  }
  if (!chat.isGroup) {
    return next(new ErrorHandler(400, 'This is not a group chat'))
  }
  if (chat.creator === user.id) {
    return next(new ErrorHandler(400, 'Group Admin cannot leave, you can only delete the group'))
  }
  // TODO: delete attachment form cloudinary
  // const index = chat.members.indexOf(req.user.id);
  // chat.members.splice(index, 1);
  await chat.save();
  // emitEvent(REFREST_CHAT, chat.members);
  sendSuccess({ res, message: 'Left group successfully' });
})

const deleteGroup = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  if (!chatId) {
    return next(new ErrorHandler(400, 'chatId is required'))
  }
  const chat = await Chat.findOne({id:chatId});
  if (!chat) {
    return next(new ErrorHandler(404, 'Chat not found'))
  }
  const user = await User.findOne({id:req.user.id});
  if (!user || chat.creator !== user.id) {
    return next(new ErrorHandler(400, 'Only group Admin can delete'))
  }
  // TODO: delete attachment form cloudinary
  await Message.deleteMany({ chatId });
  await Chat.findByIdAndDelete(chatId);
  sendSuccess({ res, message: 'Group deleted successfully' });
})

const updateGroup = TryCatch(async (req, res, next) => {
  const { chatId, name } = req.body;
  if (!chatId) {
    return next(new ErrorHandler(400, 'chatId is required'))
  }
  const chat = await Chat.findOne({id:chatId});
  if (!chat) {
    return next(new ErrorHandler(404, 'Chat not found'))
  }
  const user = await User.findOne({id:req.user.id});
  if (!user || chat.creator !== user.id) {
    return next(new ErrorHandler(400, 'Only group Admin can update'))
  }
  chat.name = name;
  await chat.save();
  // emitEvent(REFREST_CHAT, chat.members);
  sendSuccess({ res, message: 'Group updated successfully' });
})



export { newGroup, getMyGroup, addMember, removeMember, leaveGroup, deleteGroup, updateGroup };