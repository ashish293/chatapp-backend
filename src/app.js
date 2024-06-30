import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/index.js';
import { config } from 'dotenv';
import { connectDb } from './utils/connectDbCloud.js';
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser';
import { seedUsers, seedDirectChat, seedMessages } from './seeders/user.js';
config();
const port = process.env.PORT || 9000;


const app = express();
// seedUsers(10)
// await seedMessages();
connectDb();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// app.use('/api', routes);
// app.use(errorMiddleware);