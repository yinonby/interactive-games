
import type { DbProvider } from '../types/DbTypes';
import type { ExpressAppDbInfoT } from '../types/exported/ExpressTypes';
import { InmemMongoDbServer } from './InmemMongoDbServer';
import { MongoDbServer } from './MongoDbServer';

export class DbInstance {
  private dbProvider: DbProvider;

  constructor(
    private dbInfo: ExpressAppDbInfoT,
  ) {
    if (this.dbInfo.dbType === 'mysql') {
      throw new Error('MySql is currently not supported');
    } else if (this.dbInfo.dbType === 'mongodb') {
      this.dbProvider = new MongoDbServer(this.dbInfo.mongoConnString);
    } else {
      this.dbProvider = new InmemMongoDbServer();
    }
  }

  public async startDb(): Promise<void> {
    await this.dbProvider.startDb();
  }

  public async stopDb(): Promise<void> {
    await this.dbProvider.stopDb();
  }
}
