
import type { LoggerAdapter } from '@ig/utils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import type { Mongoose } from 'mongoose';
import mongoose from 'mongoose';
import { BeLogger } from '../logger/BeLogger';
import type { DbProvider } from '../types/DbTypes';

export class InmemMongoDbServer implements DbProvider {
  constructor(
    private _mongoose: Mongoose = mongoose,
    private logger: LoggerAdapter = new BeLogger(),
  ) { }

  private mongoMemoryServer: MongoMemoryServer | null = null;

  public async startDb(): Promise<void> {
    this.mongoMemoryServer = await MongoMemoryServer.create();
    const uri = this.mongoMemoryServer.getUri();
    await this._mongoose.connect(uri);
    this.logger.info(`Connected to in-memory MongoDb server at: ${uri}`);
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
