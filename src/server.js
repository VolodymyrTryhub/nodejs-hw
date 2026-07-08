import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import notesRouter from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Підключення до MongoDB
await connectMongoDB();

// Middleware
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Маршрути
app.use(notesRouter);
app.use('/auth', authRoutes);

// Middleware для обробки помилок celebrate
app.use(errors());

// Middleware для 404
app.use(notFoundHandler);

// Middleware для обробки помилок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
