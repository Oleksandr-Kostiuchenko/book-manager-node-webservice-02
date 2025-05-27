//* Constants
import { ROLES } from '../constants/index.js';

//* Http-error
import createHttpError from 'http-errors';

//* Mongoose
// import { BooksCollection } from '../db/models/book.js';

export const checkRoles =
  (...roles) =>
  async (req, res, next) => {
    const { user } = req;
    if (!user) {
      next(createHttpError(401));
      return;
    }

    const { role } = req;
    if (roles.includes(ROLES.ADMIN) && role === ROLES.ADMIN) {
      next();
      return;
    }

    if (roles.includes(ROLES.USER && role === ROLES.USER)) {
      next();
      return;
    }

    next(createHttpError(403));
  };
