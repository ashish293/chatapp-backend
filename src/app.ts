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
// import { seedUsers, seedDirectChat, seedMessages, seedGroupChat } from './seeders/user.js';
config();
const port = process.env.PORT || 9000;


const app = express();
connectDb();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.use('/api', routes);
app.use(errorMiddleware);