
import type { LoggerAdapter } from '@ig/lib';
import type {
  Model, MongooseUpdateQueryOptions,
  QueryFilter, Schema, UpdateQuery
} from 'mongoose';
import { model } from 'mongoose';
import { MongoDbTable } from './MongoDbTable';

vi.mock('mongoose');

type DocT = { name: string };

class TestMongoDbTable extends MongoDbTable<DocT> {
  protected getTableName(): string {
    return 'TestTable';
  }

  protected getSchema(): Schema {
    return {} as Schema;
  }

  public getModelForTesting(): Model<DocT> {
    return this.getModel();
  }

  public async updateExactlyOneForTesting(
    filters: QueryFilter<DocT>,
    input: UpdateQuery<DocT>,
    options?: MongooseUpdateQueryOptions<DocT>,
  ): Promise<void> {
    return await this.updateExactlyOne(filters, input, options);
  }
}

describe('MongoDbTable', () => {
  const mockLogger: LoggerAdapter = { info: vi.fn() } as unknown as LoggerAdapter;
  const updateOneMock = vi.fn();
  const mockModel: Model<{ name: string }> = {
    createCollection: vi.fn(),
    createIndexes: vi.fn(),
    updateOne: updateOneMock,
  } as unknown as Model<{ name: string }>;
  vi.mocked(model).mockReturnValue(mockModel);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
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
  });

  describe('getModel', () => {
    it('should return model from getModel', () => {
      const table = new TestMongoDbTable(false, 'prefix_', mockLogger);
      expect(table.getModelForTesting()).toBe(mockModel);
    });
  });

  describe('createTable', () => {
    it('should create table with collection and indexes', async () => {
      const table = new TestMongoDbTable(false, 'prefix_', mockLogger);
      await table.createTable();
      expect(mockModel.createCollection).toHaveBeenCalled();
      expect(mockModel.createIndexes).toHaveBeenCalled();
    });
  });

  describe('updateExactlyOne', () => {
    it('update exactly one document', async () => {
      const table = new TestMongoDbTable(false, 'prefix_', mockLogger);

      updateOneMock.mockResolvedValue({ matchedCount: 1 });

      await table.updateExactlyOneForTesting({ name: 'aaa' }, { name: 'bbb' });
    });

    it('fail to update exactly one document when no matches', async () => {
      const table = new TestMongoDbTable(false, 'prefix_', mockLogger);

      updateOneMock.mockResolvedValue({ matchedCount: 0 });

      await expect(table.updateExactlyOneForTesting({ name: 'aaa' }, { name: 'bbb' })).rejects.toThrow();
    });
  });
});
