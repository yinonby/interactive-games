
import axios from "axios";
import { Axios } from "./Axios";

// mock axios
vi.mock("axios", () => ({
  default: {
    request: vi.fn(),
  },
}));

describe("Axios HttpProvider", () => {
  const baseUrl = "https://api.test";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("performs a GET request", async () => {
    const responseData = { ok: true };
    const mockedAxiosRequest = vi.mocked(axios.request);

    mockedAxiosRequest.mockResolvedValue({
      data: responseData,
    });

    const axiosProvider = new Axios(baseUrl);
    const result = await axiosProvider.request<typeof responseData>({
      url: "/test",
      method: "GET",
    });

    expect(axios.request).toHaveBeenCalledOnce();
    expect(axios.request).toHaveBeenCalledWith({
      url: "https://api.test/test",
      method: "GET",
      data: undefined,
      withCredentials: true,
    });

    expect(result).toEqual(responseData);
  });

  it("performs a GET request without credentials", async () => {
    const responseData = { ok: true };
    const mockedAxiosRequest = vi.mocked(axios.request);

    mockedAxiosRequest.mockResolvedValue({
      data: responseData,
    });

    const axiosProvider = new Axios(baseUrl, false);
    const result = await axiosProvider.request<typeof responseData>({
      url: "/test",
      method: "GET",
    });

    expect(axios.request).toHaveBeenCalledOnce();
    expect(axios.request).toHaveBeenCalledWith({
      url: "https://api.test/test",
      method: "GET",
      data: undefined,
      withCredentials: false,
    });

    expect(result).toEqual(responseData);
  });

  it("performs a POST request", async () => {
    const requestBody = { name: "Alice" };
    const responseData = { id: 1 };
    const mockedAxiosRequest = vi.mocked(axios.request);

    mockedAxiosRequest.mockResolvedValue({
      data: responseData,
    });

    const axiosProvider = new Axios(baseUrl);
    const result = await axiosProvider.request<typeof responseData, typeof requestBody>({
      url: "/users",
      method: "POST",
      data: requestBody,
    });

    expect(axios.request).toHaveBeenCalledOnce();
    expect(axios.request).toHaveBeenCalledWith({
      url: "https://api.test/users",
      method: "POST",
      data: requestBody,
      withCredentials: true,
    });

    expect(result).toEqual(responseData);
  });
});
