import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectMongoDB } from './db/connectMongoDB.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import notesRouter from './routes/notesRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Підключення до MongoDB
await connectMongoDB();

// Middleware
app.use(logger);
app.use(express.json());
app.use(cors());

// Маршрути
app.use(notesRouter);

// Middleware для 404
app.use(notFoundHandler);

// Middleware для обробки помилок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
