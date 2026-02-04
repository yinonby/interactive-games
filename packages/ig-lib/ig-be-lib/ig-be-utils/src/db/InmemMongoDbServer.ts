
import { MongoMemoryServer } from 'mongodb-memory-server';
import type { Mongoose } from 'mongoose';
import mongoose from 'mongoose';
import type { DbProvider } from '../types/DbTypes';

export class InmemMongoDbServer implements DbProvider {
  constructor(
    private _mongoose: Mongoose = mongoose
  ) { }

  private mongoMemoryServer: MongoMemoryServer | null = null;

  public async startDb(): Promise<void> {
    this.mongoMemoryServer = await MongoMemoryServer.create();
    const uri = this.mongoMemoryServer.getUri();
    await this._mongoose.connect(uri);
  }

  public async stopDb(): Promise<void> {
    await this._mongoose.disconnect();
    if (this.mongoMemoryServer) {
      await this.mongoMemoryServer.stop();
    }
  }

  public async dropDb(): Promise<void> {
    await this._mongoose.connection.db?.dropDatabase();
  }
}
