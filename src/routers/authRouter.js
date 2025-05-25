//* Express
import express from 'express';

//* Utils
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';

//* Controllers
import {
  loginUserController,
  registerUserController,
} from '../controllers/authControllers.js';
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

export default router;
