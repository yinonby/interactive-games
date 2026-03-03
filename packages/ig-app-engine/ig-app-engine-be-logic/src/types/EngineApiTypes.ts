
import { type EngineApiErrorCodeT } from '@ig/app-engine-models';

export class EngineApiError extends Error {
  constructor(message: string, public engineApiErrorCode: EngineApiErrorCodeT) {
    super(message);
  }
}
