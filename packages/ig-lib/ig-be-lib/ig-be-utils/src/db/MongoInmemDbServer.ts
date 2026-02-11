
import type { LoggerAdapter } from '@ig/utils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { BeLogger } from '../logger/BeLogger';
import type { InmemDbServerProvider } from '../types/DbTypes';

export class MongoInmemDbServer implements InmemDbServerProvider {
  constructor(
    private logger: LoggerAdapter = new BeLogger(),
  ) { }
  private mongoMemoryServer: MongoMemoryServer | null = null;

  public async startDb(): Promise<string> {
    this.mongoMemoryServer = await MongoMemoryServer.create();
    const uri = this.mongoMemoryServer.getUri();

    this.logger.info(`Started in-memory MongoDb server at: ${uri}`);
    return uri;
  }

  public async stopDb(): Promise<void> {
    if (this.mongoMemoryServer) {
      await this.mongoMemoryServer.stop();
    }
  }
}
