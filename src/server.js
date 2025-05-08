//* Express
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

//* Utils
import { getEnvVar } from './utils/getEnvVar.js';

//*Services
import { getAllBooks, getBookById } from './services/books.js';

export const startServer = () => {
  const app = express();
  const PORT = Number(getEnvVar('PORT', 3000));

  // Lib middlewares
  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Basic middlewares
  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleTimeString()}`);
    next();
  });
  app.get('/', (req, res) => {
    res.json({
      message: 'Book-manager service',
    });
  });

  // Get books
  app.get('/books', async (req, res) => {
    const books = await getAllBooks();

    res.status(200).json({
      data: books,
    });
  });
  app.get('/books/:bookId', async (req, res) => {
    const { bookId } = req.params;
    const book = await getBookById(bookId);

    res.status(200).json({
      data: [book],
    });
  });

  // Error middlewares
  app.use((req, res, next) => {
    res.status(404).json({
      error: '404',
      message: 'This path isnt found!',
    });
  });
  app.use((err, req, res, next) => {
    res.status(500).json({
      error: '500',
      message: 'Sorry! Smth went wrong',
    });
  });

  // PORT listener
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} PORT!`);
  });
};
