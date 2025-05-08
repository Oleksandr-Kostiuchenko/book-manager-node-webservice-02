import { BooksCollection } from '../db/models/book.js';

export const getAllBooks = async () => {
  const books = await BooksCollection.find();
  console.log(books);

  return books;
};

export const getBookById = async (bookId) => {
  const book = await BooksCollection.findById(bookId);

  return book;
};
