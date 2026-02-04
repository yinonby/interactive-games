
import mongoose from 'mongoose';
import type { DbProvider } from '../types/DbTypes';

export class MongoDbServer implements DbProvider {
  constructor(
    private mongoConnString: string,
  ) { }

  public async startDb(): Promise<void> {
    await mongoose.connect(this.mongoConnString);
  }

  public async stopDb(): Promise<void> {
    await mongoose.disconnect();
  }
}
