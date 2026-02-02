
import axios from 'axios';
import type { HttpAdapter, HttpMethod } from "../../types/HttpProvider";

export class Axios implements HttpAdapter {
  constructor(
    private readonly baseUrl: string,
    private readonly withCredentials = true,
  ) {}

  async request<TResponse, TData = unknown>(options: {
    url: string;
    method: HttpMethod;
    headers?: Record<string, string>,
    data?: TData;
  }): Promise<TResponse> {
    const response = await axios.request<TResponse>({
      url: this.baseUrl + options.url,
      method: options.method,
      headers: options.headers,
      data: options.data,
      withCredentials: this.withCredentials,
    });
    return response.data;
  }
}
