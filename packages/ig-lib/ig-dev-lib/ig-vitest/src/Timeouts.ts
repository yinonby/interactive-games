

import { isCI } from 'std-env';

export const getMongoMemoryServerCreateTimeout = (): number => {
  // 15 seconds was observed in github actions (MongoMemoryServer.create() downloads mongodb binaries)
  // use 60 seconds just in case
  return isCI ? 60000 : 10000;
}
