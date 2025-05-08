//* Mongoose
import mongoose from 'mongoose';

//* Utils
import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoDb = async () => {
  try {
    const user = getEnvVar('MONGODB_USER');
    const pwd = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );
    console.log(`Mongo connected!`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
