
export interface DbClientProvider {
  dbConnect(): Promise<void>;
  dbDisconnet(): Promise<void>;
  dropDb(): Promise<void>;
}

export interface InmemDbServerProvider {
  startDb(): Promise<string>;
  stopDb(): Promise<void>;
}
