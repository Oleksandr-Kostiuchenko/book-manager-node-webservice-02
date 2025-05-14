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

//* Init Router
const router = express.Router();

router.get('/', ctrlWrapper(getBooksController));
router.get('/:bookId', ctrlWrapper(getBookByIdController));

router.post('/', ctrlWrapper(createBookController));

router.delete('/:bookId', ctrlWrapper(deleteBookController));

router.put('/:bookId', ctrlWrapper(putBookController));

router.patch('/:bookId', ctrlWrapper(patchBookController));

export default router;
