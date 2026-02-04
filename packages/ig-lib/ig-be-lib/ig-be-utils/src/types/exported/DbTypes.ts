
export interface PackageDbAdapter {
  createTables: (registerSchema: boolean, tableNamePrefix?: string) => Promise<void>;
}

export abstract class PackageDb implements PackageDbAdapter {
  public abstract createTables(registerSchema: boolean, tableNamePrefix?: string): Promise<void>;

  public async init(tableNamePrefix?: string): Promise<void> {
    await this.createTables(true, tableNamePrefix);
  }

  public async recreate(tableNamePrefix?: string): Promise<void> {
    await this.createTables(false, tableNamePrefix);
  }
}
