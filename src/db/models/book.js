//* Mongoose
import { Schema, model } from 'mongoose';

const booksSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      required: true,
      enum: [
        'Fiction',
        'Non-fiction',
        'Mystery',
        'Fantasy',
        'Science Fiction',
        'Biography',
        'Romance',
        'Historical',
        'Thriller',
        'Horror',
        'Self-help',
        'Philosophy',
        'Poetry',
        'Young Adult',
        'Children',
        'Graphic Novel',
        'Classic',
      ],
    },
    isRead: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const BooksCollection = model('books', booksSchema);
