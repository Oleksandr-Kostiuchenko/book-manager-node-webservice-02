//* Constants
import { ONE_DAY } from '../constants/index.js';

//* Services
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  requestResetEmail,
  resetPassword,
} from '../services/auth.js';
import { generateAuthUrl } from '../utils/googleOAuthClient.js';
import { loginOrSignupWithGoogle } from '../services/auth.js';

export const registerUserController = async (req, res, next) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'User successfully created!',
    data: user,
  });
};

export const loginUserController = async (req, res, next) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res, next) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

const setUpSession = (res, session) => {
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshUserSessionController = async (req, res, next) => {
  const newSession = await refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setUpSession(res, newSession);

  res.status(200).json({
    status: 200,
    message: 'User session is successfully refreshed!',
    data: {
      accessToken: newSession.accessToken,
    },
  });
};

export const requestResetEmailController = async (req, res, next) => {
  const { email } = req.body;
  const request = await requestResetEmail(email);

  res.status(200).json({
    status: 200,
    message: 'Reset password email was successfully sent!',
    data: {},
  });
};

export const resetPasswordController = async (req, res, next) => {
  await resetPassword(req.body);

  res.status(200).json({
    status: 200,
    message: 'Password was successfuly reset!',
    data: {},
  });
};

export const getOauthUrlController = (req, res, next) => {
  const url = generateAuthUrl();

  res.status(200).json({
    status: 200,
    message: 'Successfully generated OAuth url',
    data: {
      url,
    },
  });
};

export const confirmOAuthController = async (req, res, next) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
  setUpSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully authenticated with google',
    data: {
      accessToken: session.accessToken,
    },
  });
};
