
import type { DbClientProvider } from '../types/DbTypes';
import type { ExpressAppDbInfoT } from '../types/exported/ExpressTypes';
import { MongoDbClient } from './MongoDbClient';

export class DbClient {
  private dbClientProvider: DbClientProvider;

  constructor(
    private dbInfo: ExpressAppDbInfoT,
  ) {
    if (this.dbInfo.dbType === 'mysql') {
      throw new Error('MySql is currently not supported');
    } else if (this.dbInfo.dbType === 'mongodb') {
      this.dbClientProvider = new MongoDbClient(this.dbInfo.mongoConnString);
    } else {
      throw new Error ('Unexpected db type');
    }
  }

  public async dbConnect(): Promise<void> {
    await this.dbClientProvider.dbConnect();
  }

  public async dbDisconnect(): Promise<void> {
    await this.dbClientProvider.dbDisconnect();
  }

  public async dropDb(): Promise<void> {
    await this.dbClientProvider.dropDb();
  }
}
