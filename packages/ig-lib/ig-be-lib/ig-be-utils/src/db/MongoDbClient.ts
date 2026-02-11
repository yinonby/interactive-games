
import mongoose from 'mongoose';
import type { DbClientProvider } from '../types/DbTypes';

export class MongoDbClient implements DbClientProvider {
  constructor(
    private mongoConnString: string,
  ) { }

  public async dbConnect(): Promise<void> {
    await mongoose.connect(this.mongoConnString);
  }

  public async dbDisconnect(): Promise<void> {
    await mongoose.disconnect();
  }

  public async dropDb(): Promise<void> {
    await mongoose.connection.db?.dropDatabase();
  }
}
