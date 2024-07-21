import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/index';
import { config } from 'dotenv';
import { connectDb } from './utils/connectDbCloud';
import { errorMiddleware } from './middlewares/error';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import "./types/express"
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { socketEvent } from './utils/socket';
import { socketAuth } from './middlewares/auth';


// import { seedUsers, seedDirectChat, seedMessages, seedGroupChat } from './seeders/user.js';
config();
const port = process.env.PORT || 9000;

const onlineUsers = new Map();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors:{
    origin: 'http://localhost:5173',
    credentials: true
  },
  cookie:true
});
app.set("io", io)
app.set("onlineUsers", onlineUsers)
io.use(socketAuth);
connectDb();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
socketEvent(io);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.use('/api', routes);
app.use(errorMiddleware);