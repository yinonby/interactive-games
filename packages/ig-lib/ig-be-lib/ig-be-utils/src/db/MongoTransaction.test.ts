
import type { LoggerAdapter } from '@ig/utils';
import { getMongoMemoryServerCreateTimeout } from '@ig/vitest';
import { model, Schema, type SchemaDefinition } from 'mongoose';
import { DbClient } from './DbClient';
import { MongoInmemDbServer } from './MongoInmemDbServer';
import { MongoTransaction } from './MongoTransaction';

describe('MongoTransaction (integration)', () => {
  let mongoInmemDbServer: MongoInmemDbServer;
  let dbClient: DbClient;
  const mock_logger = { error: vi.fn() } as unknown as LoggerAdapter;

  beforeAll(async () => {
    // start a local mongo inmem server
    mongoInmemDbServer = new MongoInmemDbServer();
    const uri = await mongoInmemDbServer.startDb();

    dbClient = new DbClient({ dbType: 'mongodb', mongoConnString: uri, tableNamePrefix: '' });
    await dbClient.dbConnect();
  }, getMongoMemoryServerCreateTimeout());

  afterAll(async () => {
    await mongoInmemDbServer.stopDb();
  });

  it('should instantiate with default args', () => {
    new MongoTransaction();
  });

  it('should start a transaction and return context with session', async () => {
    const transaction = new MongoTransaction();

    const ctx = await transaction.start();

    expect(ctx).toBeDefined();
    expect(ctx.session).toBeDefined();
    expect(ctx.session.inTransaction()).toBe(true);

    // cleanup
    await transaction.execute();
  });

  it('should commit transaction successfully', async () => {
    const transaction = new MongoTransaction(mock_logger);

    await transaction.start();

    await expect(transaction.execute()).resolves.toBeUndefined();
  });

  it('should throw if execute is called before start', async () => {
    const transaction = new MongoTransaction(mock_logger);

    await expect(transaction.execute()).rejects.toThrow(
      'Transaction session not started',
    );
  });

  it('should throw when commit fails', async () => {
    type TestT = {name: string};
    const testSchemaDef = (): SchemaDefinition<TestT> => ({
      name: {
        type: String,
        required: true,
        unique: true,
      },
    });
    const testSchema = new Schema<TestT>(testSchemaDef, {
      timestamps: true,
    });
    const testModel = model<TestT>('testitems', testSchema);

    const transaction = new MongoTransaction(mock_logger);

    const ctx = await transaction.start();

    await testModel.insertOne({ name: 'n1'}, { session: ctx?.session });
    await testModel.insertOne({ name: 'n1'}, { session: ctx?.session }); // unique, should fail

    await expect(transaction.execute()).rejects.toThrow();
  });
});
