//* Mongoose
import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

const SessionSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessTokenValidUntil: {
    type: Date,
    required: true,
  },
  refreshTokenValidUntil: {
    type: Date,
    required: true,
  },
});

export const SessionCollection = model('sessions', SessionSchema);
