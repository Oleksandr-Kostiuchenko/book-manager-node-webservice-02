//* Express
import express from 'express';

//* Multer
import { upload } from '../middlewares/multer.js';

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

//* Middlewares
import { authenticate } from '../middlewares/authenticate.js';

//* Validation
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createBookSchema, updateBookSchema } from '../validation/books.js';

//* Init Router
const router = express.Router();

//* AUTH
router.use(authenticate);

//* GET
router.get('/', ctrlWrapper(getBooksController));
router.get('/:bookId', isValidId, ctrlWrapper(getBookByIdController));

//* POST
router.post(
  '/',
  upload.single('photo'),
  validateBody(createBookSchema),
  ctrlWrapper(createBookController),
);

//* DELETE
router.delete('/:bookId', isValidId, ctrlWrapper(deleteBookController));

//* PUT
router.put(
  '/:bookId',
  isValidId,
  upload.single('photo'),
  validateBody(updateBookSchema),
  ctrlWrapper(putBookController),
);

//* PATCH
router.patch(
  '/:bookId',
  isValidId,
  upload.single('photo'),
  validateBody(updateBookSchema),
  ctrlWrapper(patchBookController),
);

export default router;
