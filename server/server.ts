import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import { user } from './routes/user';

// Usage of .env file in the root dir
dotenv.config();

const app = express();

const PORT = process.env.APP_PORT || 5000;
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());
// To get full req.body in JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply routes
app.use('/', user);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Listening to', PORT);
});
