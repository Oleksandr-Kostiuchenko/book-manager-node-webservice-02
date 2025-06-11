//* Express
import express from 'express';

//* Utils
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  validateConfirmOAuthSchema,
} from '../validation/auth.js';

//* Controllers
import {
  loginUserController,
  registerUserController,
  logoutUserController,
  refreshUserSessionController,
  requestResetEmailController,
  resetPasswordController,
  getOauthUrlController,
  confirmOAuthController,
} from '../controllers/authControllers.js';

//* Middlewares
import { validateBody } from '../middlewares/validateBody.js';

//* Init Router
const router = express.Router();

//* REGISTER
router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

//* LOGIN
router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

//* GET GOOGLE AUTH URL
router.post('/get-oauth-url', ctrlWrapper(getOauthUrlController));

//* CONFIRM GOOGLE AUTH URL
router.post(
  '/confirm-oauth',
  validateBody(validateConfirmOAuthSchema),
  ctrlWrapper(confirmOAuthController),
);

//* LOGOUT
router.post('/logout', ctrlWrapper(logoutUserController));

//* REFRESH
router.post('/refresh', ctrlWrapper(refreshUserSessionController));

//* REQUEST-RESET
router.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

//* RESET
router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
