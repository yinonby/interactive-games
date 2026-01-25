
import type { LoggerAdapter } from '@ig/lib';
import type { Model, Schema } from 'mongoose';
import { model } from 'mongoose';
import { MongoDbTable } from './MongoDbTable';

vi.mock('mongoose');

class TestMongoDbTable extends MongoDbTable<{ name: string }> {
  protected getTableName(): string {
    return 'TestTable';
  }

  protected getSchema(): Schema {
    return {} as Schema;
  }
}

describe('MongoDbTable', () => {
  const mockLogger: LoggerAdapter = { info: vi.fn() } as unknown as LoggerAdapter;
  const mockModel: Model<{ name: string }> = {
    createCollection: vi.fn(),
    createIndexes: vi.fn()
  } as unknown as Model<{ name: string }>;
  vi.mocked(model).mockReturnValue(mockModel);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with defaults', () => {
    new TestMongoDbTable(true);
    expect(model).toHaveBeenCalledWith('TestTable', expect.any(Object));
  });

  it('should register schema when registerSchema is true', () => {
    new TestMongoDbTable(true, 'prefix_', mockLogger);
    expect(model).toHaveBeenCalledWith('prefix_TestTable', expect.any(Object));
    expect(mockLogger.info).toHaveBeenCalledWith('Registering schema, tableName [prefix_TestTable]');
  });

  it('should not register schema when registerSchema is false', () => {
    new TestMongoDbTable(false, 'prefix_', mockLogger);
    expect(model).toHaveBeenCalledWith('prefix_TestTable');
    expect(mockLogger.info).not.toHaveBeenCalled();
  });

  it('should return model from getModel', () => {
    const table = new TestMongoDbTable(false, 'prefix_', mockLogger);
    expect(table.getModel()).toBe(mockModel);
  });

  it('should create table with collection and indexes', async () => {
    const table = new TestMongoDbTable(false, 'prefix_', mockLogger);
    await table.createTable();
    expect(mockModel.createCollection).toHaveBeenCalled();
    expect(mockModel.createIndexes).toHaveBeenCalled();
  });
});
