//* Express
import express from 'express';
import { Router } from 'express';

//* Routers
import booksRouter from './booksRouter.js';
import authRouter from './authRouter.js';

const router = Router();

//* BOOKS
router.use('/books', booksRouter);

//* AUTH
router.use('/auth', authRouter);

export default router;
