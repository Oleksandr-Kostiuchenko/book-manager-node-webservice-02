//* FS
import fs from 'fs/promises';

export const createDirIfNoExists = async (url) => {
  try {
    const dir = await fs.access(url);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(url);
    }
  }
};
