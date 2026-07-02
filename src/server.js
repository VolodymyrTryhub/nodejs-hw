import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectMongoDB } from './db/connectMongoDB.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ====================
// Middleware
// ====================

app.use(logger);
app.use(cors());
app.use(express.json());

// ====================
// Маршрути
// ====================

app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;

  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// Тестовий маршрут
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// ====================
// Middleware
// ====================

app.use(notFoundHandler);
app.use(errorHandler);

// ====================
// Запуск сервера
// ====================

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
