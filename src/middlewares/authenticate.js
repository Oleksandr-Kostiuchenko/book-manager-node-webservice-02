//* Http-error
import createHttpError from 'http-errors';

//* Mongoose
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header'));
    //   next()
    return;
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Authorization header must be of type Bearer'));
    return;
  }

  const session = await SessionCollection.findOne({
    accessToken: token,
  });
  if (!session) {
    next(createHttpError(401, 'Session not found!'));
  }

  const isAccessTokenExpired = new Date() > session.accessTokenValidUntil;
  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired!'));
  }

  const user = await UserCollection.findById(session.userId);
  if (!user) {
    next(createHttpError(401));
    return;
  }

  req.user = user;
  next();
};
