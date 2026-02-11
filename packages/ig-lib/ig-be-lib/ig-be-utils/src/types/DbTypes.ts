
export interface DbClientProvider {
  dbConnect(): Promise<void>;
  dbDisconnect(): Promise<void>;
  dropDb(): Promise<void>;
}

export interface InmemDbServerProvider {
  startDb(): Promise<string>;
  stopDb(): Promise<void>;
}
