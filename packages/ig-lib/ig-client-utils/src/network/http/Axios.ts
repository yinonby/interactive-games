
import axios from 'axios';
import type { HttpAdapter, HttpMethod } from "../../types/HttpProvider";

export class Axios implements HttpAdapter {
  constructor(
    private readonly baseUrl: string,
  ) {}

  async request<TResponse, TData = unknown>(options: {
    url: string;
    method: HttpMethod;
    data?: TData;
  }): Promise<TResponse> {
    const response = await axios.request<TResponse>({
      url: this.baseUrl + options.url,
      method: options.method,
      data: options.data,
    });
    return response.data;
  }
}
