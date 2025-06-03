//* Cloudinary
import { CLOUDINARY } from '../constants/index.js';
import cloudinary from 'cloudinary';

//* FS & Vars
import fs from 'fs/promises';
import { getEnvVar } from './getEnvVar.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
});

export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.v2.uploader.upload(file.path);
  await fs.unlink(file.path);
  return response.secure_url;
};
