//* Contants & Files
import { UPLOAD_DIR, TEMP_UPLOAD_DIR } from './constants/index.js';
import { createDirIfNoExists } from './utils/createDirIfNoExists.js';

//* Start functions
import { startServer } from './server.js';
import { initMongoDb } from './db/initMongoDb.js';

const bootstrap = async () => {
  await initMongoDb();

  await createDirIfNoExists(TEMP_UPLOAD_DIR);
  await createDirIfNoExists(UPLOAD_DIR);

  startServer();
};

bootstrap();
