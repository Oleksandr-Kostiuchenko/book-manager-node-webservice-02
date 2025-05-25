//* Express
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

//* Utils
import { getEnvVar } from './utils/getEnvVar.js';

//* Middlewares
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

//* Routers
import router from './routers/index.js';

export const startServer = () => {
  const app = express();
  const PORT = Number(getEnvVar('PORT', 3000));

  // Lib middlewares
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
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

  // BOOKS + AUTH
  app.use(router);

  // Error middlewares
  app.use(notFoundHandler);
  app.use(errorHandler);

  // PORT listener
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} PORT!`);
  });
};
