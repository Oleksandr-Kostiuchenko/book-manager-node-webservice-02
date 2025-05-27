//* Services
import {
  getAllBooks,
  getBookById,
  createBook,
  deleteBook,
  putBook,
} from '../services/books.js';

//* Pagination
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

//* Http-errors
import createHttpError from 'http-errors';

//  GET
export const getBooksController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const books = await getAllBooks({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
    user: req.user,
  });

  if (!books) {
    throw createHttpError(404, 'Books not found!');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found books!',
    data: books,
  });
};
export const getBookByIdController = async (req, res, next) => {
  const { bookId } = req.params;
  const book = await getBookById({
    bookId: bookId,
    user: req.user,
  });

  if (!book) {
    throw createHttpError(404, 'Book not found!');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found book with ${bookId} ID!`,
    data: book,
  });
};

//  POST
export const createBookController = async (req, res, next) => {
  const book = await createBook({
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).json({
    status: 201,
    message: 'Book was successfully created!',
    data: book,
  });
};

//  DELETE
export const deleteBookController = async (req, res, next) => {
  const { bookId } = req.params;
  const book = await deleteBook({ bookId, user: req.user });

  if (!book) {
    throw createHttpError(404, 'Book not found!');
  }

  res.status(204).json({
    status: 204,
    message: 'Book was successfully deleted!',
    data: book,
  });
};

// PUT
export const putBookController = async (req, res, next) => {
  const { bookId } = req.params;
  const result = await putBook({
    bookId,
    payload: req.body,
    options: { upsert: true },
    user: req.user,
  });

  const status = result.isNew ? 201 : 200;
  res.status(status).json({
    status: status,
    message: 'Successfully upserted a book!',
    data: result.book,
  });
};

// PATCH
export const patchBookController = async (req, res, next) => {
  const { bookId } = req.params;
  const result = await putBook({ bookId, payload: req.body, user: req.user });

  if (!result) {
    throw createHttpError(404, 'Book not found!');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a book!',
    data: result.book,
  });
};
