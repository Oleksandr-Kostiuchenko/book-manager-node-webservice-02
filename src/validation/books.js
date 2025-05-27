//* Joi
import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const createBookSchema = Joi.object({
  title: Joi.string().min(3).max(25).required().messages({
    'base.string': 'Book title should be a string',
    'base.min': 'Book title should have min {#limit} symbols',
    'base.max': 'Book title should have max {#limit} symbols',
    'base.required': 'Book title is required!',
  }),
  author: Joi.string().min(3).required(),
  year: Joi.number().required(),
  genre: Joi.string()
    .valid(
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
      'Motivation',
    )
    .required(),
  isRead: Joi.boolean().required(),
  userId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('User id should be valid Mongo ID');
    }
    return true;
  }),
});

export const updateBookSchema = Joi.object({
  title: Joi.string().min(3).max(25).messages({
    'base.string': 'Book title should be a string',
    'base.min': 'Book title should have min {#limit} symbols',
    'base.max': 'Book title should have max {#limit} symbols',
    'base.required': 'Book title is required!',
  }),
  author: Joi.string().min(3),
  year: Joi.number(),
  genre: Joi.string().valid(
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
    'Motivation',
  ),
  isRead: Joi.boolean(),
});
