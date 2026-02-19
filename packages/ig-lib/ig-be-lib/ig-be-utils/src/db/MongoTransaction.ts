

import type { LoggerAdapter } from '@ig/utils';
import mongoose, { type ClientSession } from 'mongoose';
import { BeLogger } from '../logger/BeLogger';
import type { MongoDbTransactionContext } from '../types/exported/DbTypes';

export class MongoTransaction {
  private session: ClientSession | null = null;

  constructor(
    private logger: LoggerAdapter = new BeLogger(),
  ) { }

  public async start(): Promise<MongoDbTransactionContext> {
    this.session = await mongoose.startSession();
    this.session.startTransaction();

    const ctx: MongoDbTransactionContext = { session: this.session };
    return ctx;
  }

  public async execute(): Promise<void> {
    if (this.session === null) {
      throw new Error('Transaction session not started. Call start() before execute().');
    }

    try {
      await this.session.commitTransaction();
    } catch (error) {
      try {
        await this.session.abortTransaction();
      } catch (abortError) {
        this.logger.error('Failed to abort transaction after commit failure:', abortError);
      }
      throw error;
    } finally {
      await this.session.endSession();
      this.session = null;
    }
  }
}
