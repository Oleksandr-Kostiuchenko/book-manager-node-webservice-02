//* Express
import express from 'express';

//* Utils
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';

//* Controllers
import {
  loginUserController,
  registerUserController,
  logoutUserController,
  refreshUserSessionController,
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

//* LOGOUT
router.post('/logout', ctrlWrapper(logoutUserController));

//* REFRESH
router.post('/refresh', ctrlWrapper(refreshUserSessionController));

export default router;
