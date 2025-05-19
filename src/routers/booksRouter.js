//* Express
import express from 'express';

//* Controllers
import {
  getBooksController,
  getBookByIdController,
  createBookController,
  deleteBookController,
  putBookController,
  patchBookController,
} from '../controllers/booksControllers.js';

//* Utils
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

//* Validation
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createBookSchema, updateBookSchema } from '../validation/books.js';

//* Init Router
const router = express.Router();

//* GET
router.get('/', ctrlWrapper(getBooksController));
router.get('/:bookId', isValidId, ctrlWrapper(getBookByIdController));

//* POST
router.post(
  '/',
  validateBody(createBookSchema),
  ctrlWrapper(createBookController),
);

//* DELETE
router.delete('/:bookId', isValidId, ctrlWrapper(deleteBookController));

//* PUT
router.put(
  '/:bookId',
  isValidId,
  validateBody(updateBookSchema),
  ctrlWrapper(putBookController),
);

//* PATCH
router.patch(
  '/:bookId',
  isValidId,
  validateBody(updateBookSchema),
  ctrlWrapper(patchBookController),
);

export default router;
