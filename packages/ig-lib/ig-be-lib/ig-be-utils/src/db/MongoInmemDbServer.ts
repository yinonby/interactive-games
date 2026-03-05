
import type { LoggerAdapter } from '@ig/utils';
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { BeLogger } from '../logger/BeLogger';
import type { InmemDbServerProvider } from '../types/DbTypes';

export class MongoInmemDbServer implements InmemDbServerProvider {
  private mongoMemoryReplSet: MongoMemoryReplSet | null = null;

  constructor(
    private logger: LoggerAdapter = new BeLogger(),
    private listenPort?: number,
  ) { }

  public async startDb(): Promise<string> {
    // IMPORTANT: use MongoMemoryReplSet for transactions
    this.mongoMemoryReplSet = await MongoMemoryReplSet.create({
      instanceOpts: [{ port: this.listenPort }],
      replSet: { count: 1 },
    });
    const uri = this.mongoMemoryReplSet.getUri();

    this.logger.info(`Started in-memory MongoDb server at: ${uri}`);
    return uri;
  }

  public async stopDb(): Promise<void> {
    if (this.mongoMemoryReplSet) {
      await this.mongoMemoryReplSet.stop();
    }
  }
}
