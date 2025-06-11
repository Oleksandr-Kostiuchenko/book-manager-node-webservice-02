//* Http-error
import createHttpError from 'http-errors';

//* Swagger
import swaggerUI from 'swagger-ui-express';
import { SWAGGER_PATH } from '../constants/index.js';

//* Node
import fs from 'node:fs';

export const swaggerDocs = () => {
  try {
    const swaggerDocs = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDocs)];
  } catch (error) {
    return (req, res, next) => {
      next(createHttpError(500, "Can't load swagger docs"));
    };
  }
};
