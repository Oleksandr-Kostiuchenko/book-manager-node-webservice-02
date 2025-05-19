import { BooksCollection } from '../db/models/book.js';
import { calculatePaginationData } from '../middlewares/calculatePaginationData.js';

export const getAllBooks = async ({ page, perPage }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const booksQuery = BooksCollection.find();
  const booksCount = await BooksCollection.find()
    .merge(booksQuery)
    .countDocuments();

  const books = await booksQuery.skip(skip).limit(limit).exec();
  const paginationData = calculatePaginationData(booksCount, page, perPage);

  return {
    data: books,
    ...paginationData,
  };
};

export const getBookById = async (bookId) => {
  const book = await BooksCollection.findById(bookId);

  return book;
};

export const createBook = async (payload) => {
  const book = await BooksCollection.create(payload);

  return book;
};

export const deleteBook = async (bookId) => {
  const book = await BooksCollection.findOneAndDelete({
    _id: bookId,
  });

  return book;
};

export const putBook = async (bookId, payload, options) => {
  const result = await BooksCollection.findOneAndUpdate(
    { _id: bookId },
    payload,
    { new: true, includeResultMetadata: true, ...options },
  );

  if (!result || !result.value) return null;

  return {
    book: result.value,
    isNew: Boolean(result?.lastErrorObject?.upserted),
  };
};
