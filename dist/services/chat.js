import Chat from '../models/chat.js';
import Message from '../models/message.js';
import { v4 as uuid } from 'uuid';
const sendMessageService = async (chatId, message, user, userList) => {
    const chat = await Chat.findOne({ id: chatId });
    if (!chat)
        return;
    const id = uuid();
    const createdAt = new Date();
    const msg = await Message.create({
        id,
        chatId: chatId,
        content: message,
        sender: user._id,
        createdAt
    });
    chat.lastMessage = msg._id;
    chat.save();
    const realtimeResponse = {
        id,
        chatId,
        content: message,
        sender: { id: user?.id },
        createdAt
    };
    const onlineMembers = chat.members?.reduce((acc, member) => {
        if (member._id.toString() == user._id.toString())
            return acc;
        const socketId = userList.get(member.toString());
        if (socketId)
            return [...acc, socketId];
        return acc;
    }, []);
    console.log('online', onlineMembers);
    // emitEvent()
    // io.to(onlineMembers).emit(events.NEW_MESSAGE,realtimeResponse )
};
