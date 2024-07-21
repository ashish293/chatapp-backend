import { parse } from "cookie";
import { Server, Socket } from 'socket.io';
import { NEW_MESSAGE } from '../constant/event';



const socketEvent = (io:Server)=>{
 
  io.on('connection', (socket:Socket) => {
    console.log('a user connected');
    io.on('headers', (headers:any, request:any) => {
      const cookies = parse(request.headers.cookie);
      console.log("cook",cookies);
      
    })
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on(NEW_MESSAGE, ({msg})=>{
      console.log(msg);
      
    })
  })
}



export { socketEvent };
