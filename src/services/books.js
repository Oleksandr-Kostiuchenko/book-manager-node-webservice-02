//* Pagination & Sorting & Filtering
import { BooksCollection } from '../db/models/book.js';
import { calculatePaginationData } from '../middlewares/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllBooks = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const booksQuery = BooksCollection.find();

  if (filter.author) {
    booksQuery.where('author').equals(filter.author);
  }
  if (filter.maxYear) {
    booksQuery.where('year').lte(filter.maxYear);
  }
  if (filter.minYear) {
    booksQuery.where('year').gte(filter.minYear);
  }
  if (filter.genre) {
    booksQuery.where('genre').equals(filter.genre);
  }
  if (filter.isRead) {
    booksQuery.where('isRead').equals(filter.isRead);
  }

  const booksCount = await BooksCollection.find()
    .merge(booksQuery)
    .countDocuments();

  const books = await booksQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
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
