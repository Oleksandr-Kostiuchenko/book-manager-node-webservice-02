//* Templates
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

//* Constants
import { FIFTEEN_MINUTES, ONE_DAY, TEMPLATES_DIR } from '../constants/index.js';

//* Utils
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuthClient.js';

//* Mongoose
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';

//* Http-error
import createHttpError from 'http-errors';

//* Bcrypt
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

//* Send email tools & Constants
import jwt from 'jsonwebtoken';
import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendMail } from '../utils/sendMail.js';

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

export const requestResetEmail = async (email) => {
  const user = await UserCollection.findOne({
    email: email,
  });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendMail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (err) {
    console.error('SendMail error:', err);
    throw createHttpError(500, 'Failed to send reset email');
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, error.message);
    throw error;
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(401, 'User not found!');
  }

  const encryptedUserPassword = await bcrypt.hash(payload.password, 10);
  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedUserPassword },
  );
};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  const fullName = getFullNameFromGoogleTokenPayload(payload);

  let user = await UserCollection.findOne({
    email: payload.email,
  });

  if (!user) {
    const hashedPassword = await bcrypt.hash(randomBytes(10), 10);
    user = await UserCollection.create({
      email: payload.email,
      name: fullName,
      password: hashedPassword,
      role: 'user',
    });
  }

  console.log(user);

  const newSession = createSession();
  return await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};
