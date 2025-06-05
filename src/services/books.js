//* CONSTANTS
import { ROLES } from '../constants/index.js';

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
  user,
}) => {
  const { _id, role } = user;

  const limit = perPage;
  const skip = (page - 1) * perPage;

  let booksQuery;
  if (role === ROLES.USER) {
    booksQuery = BooksCollection.find({
      $or: [{ userId: _id }, { userId: { $exists: false } }],
    });
  } else if (role === ROLES.ADMIN) {
    booksQuery = BooksCollection.find();
  }

  if (filter.myBooks) {
    booksQuery.where('userId').equals(_id);
  }
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

export const getBookById = async ({ bookId, user }) => {
  const { _id, role } = user;

  let book;

  if (role === ROLES.USER) {
    book = await BooksCollection.findOne({
      _id: bookId,
      userId: _id,
    });
  } else if (role === ROLES.ADMIN) {
    book = await BooksCollection.findById(bookId);
  }

  return book;
};

export const createBook = async (payload) => {
  console.log(payload);
  const book = await BooksCollection.create(payload);

  return book;
};

export const deleteBook = async ({ bookId, user }) => {
  const { _id, role } = user;

  let book;

  if (role === ROLES.USER) {
    book = await BooksCollection.findOneAndDelete({
      _id: bookId,
      userId: _id,
    });
  } else if (role === ROLES.ADMIN) {
    book = await BooksCollection.findOneAndDelete({
      _id: bookId,
    });
  }

  return book;
};

export const putBook = async ({ bookId, payload, options, user, photo }) => {
  const { _id, role } = user;

  let result;

  if (role === ROLES.USER) {
    result = await BooksCollection.findOneAndUpdate(
      { _id: bookId, userId: _id },
      { ...payload, photo: photo },
      {
        new: true,
        includeResultMetadata: true,
        ...options,
      },
    );
  } else if (role === ROLES.ADMIN) {
    result = await BooksCollection.findOneAndUpdate(
      { _id: bookId },
      { ...payload, photo: photo },
      {
        new: true,
        includeResultMetadata: true,
        ...options,
      },
    );
  }

  if (!result || !result.value) return null;

  return {
    book: result.value,
    isNew: Boolean(result?.lastErrorObject?.upserted),
  };
};
