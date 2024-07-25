import { parse } from "cookie";
import { Server, Socket } from 'socket.io';
import events from '../constant/events';
import {v4 as uuid} from 'uuid'
import Message from "../models/message";
import Chat from "../models/chat";
import {Types} from 'mongoose'



const socketEvent = (io:Server)=>{

  const userList = new Map<string, string>()

  io.on('connection', (socket:Socket) => {
    userList.set( socket.data?.user?._id?.toString(), socket.id);
    console.log('a user connected');
    socket.on('disconnect', () => {
      userList.delete(socket.data?.user?._id?.toString())
      console.log('user disconnected');
    });
    socket.on(events.MESSAGE, async ({message, chatId}, cb)=>{
      try {
        
     
      const chat = await Chat.findOne({id:chatId}).lean()
      const id = uuid()
      const createdAt = new Date()
      await Message.create({
        id,
        chatId:chat?._id,
        content:message,
        sender:socket.data?.user?._id,
        createdAt
      })
      if(!chat) return
      const onlineMembers = chat.members?.reduce((acc, member)=>{
        console.log('mem', member);
        if(member._id.toString() == socket.data?.user?._id) return acc
        const socketId = userList.get(member.toString())
        if(socketId) return [...acc, socketId]
        return acc
      },<string[]>[])
      console.log('online', onlineMembers);
      const realtimeResponse = {
        id,
        chatId,
        content:message,
        sender:{id:socket.data?.user?.id},
        createdAt
      }
      io.to(onlineMembers).emit(events.NEW_MESSAGE,realtimeResponse )
      cb({success:true, data:realtimeResponse})
    } catch (error:any) {
        console.log(error);
        cb({success:false, message:error.message})
    }
    })
    
  })
}



export { socketEvent };
