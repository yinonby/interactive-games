
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpAdapter {
  request<TResponse = unknown, TData = unknown>(options: {
    url: string;
    method: HttpMethod;
    headers?: Record<string, string>,
    data?: TData;
  }): Promise<TResponse>;
}
