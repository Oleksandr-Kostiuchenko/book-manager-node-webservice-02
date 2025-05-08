import dotenv from 'dotenv';
dotenv.config();

export const getEnvVar = (name, initialValue) => {
  if (process.env[name]) return process.env[name];

  if (initialValue) return initialValue;

  throw new Error(`Missing: process.env[${name}]`);
};
