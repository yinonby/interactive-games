
import type { AppErrorCodeT } from './AppErrorTypes';

export type ModelT<T> =
  | { isLoading: true; isError: false; appErrCode?: undefined; data?: undefined }
  | { isLoading: false; isError: true; appErrCode: AppErrorCodeT; data?: undefined }
  | { isLoading: false; isError: false; appErrCode?: undefined; data: T;  };
