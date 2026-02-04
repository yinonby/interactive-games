
export interface DbProvider {
  startDb(): Promise<void>;
  stopDb(): Promise<void>;
}
