import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/index.js';
import { config } from 'dotenv';
import { connectDb } from './utils/connectDbCloud.js';
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import "./types/dataType.js";
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { socketEvent } from './utils/socket.js';
import { socketAuth } from './middlewares/auth.js';

// import { seedUsers, seedDirectChat, seedMessages, seedGroupChat } from './seeders/user';
config();
const port = process.env.PORT || 9000;

const onlineUsers = new Map();
const app = express();
const server = createServer(app);
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

const corsConfig = {
  origin: (origin: string | undefined, callback: (error: Error | null, origin?: string) => void) => {
    if (allowedOrigins.includes(origin as string) || !origin) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const io = new Server(server, {
  cors: corsConfig,
  cookie: true,
});
app.set("io", io);
app.set("onlineUsers", onlineUsers);
io.use(socketAuth);
connectDb();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsConfig));
socketEvent(io, app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/api', routes);
app.use(errorMiddleware);
