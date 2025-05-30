//* Constants
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';

//* Mongoose
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';

//* Http-error
import createHttpError from 'http-errors';

//* Bcrypt
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

export const registerUser = async (payload) => {
  const encryptedUserPassword = await bcrypt.hash(payload.password, 10);

  return await UserCollection.create({
    ...payload,
    password: encryptedUserPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'User not found!');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({
    _id: sessionId,
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};
export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found!');
  }

  const isTokenExpired = new Date() > session.refreshTokenValidUntil;
  if (isTokenExpired) {
    throw createHttpError(401, 'Session token expired!');
  }

  const newSession = createSession();

  await SessionCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
