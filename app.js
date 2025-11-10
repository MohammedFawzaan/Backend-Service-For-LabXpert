import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectMongoDb from './db/mongodb.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();

connectMongoDb();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRoutes);

export default app;