import axios, { type AxiosRequestConfig } from "axios";

export const AXIOS_METHOD = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
} as const;

export type AxiosMethod = (typeof AXIOS_METHOD)[keyof typeof AXIOS_METHOD];

export const CONTENT_HEADER = {
  JSON: "application/json",
  MULTIPART: "multipart/form-data",
} as const;

export type ContentHeader =
  (typeof CONTENT_HEADER)[keyof typeof CONTENT_HEADER];

export interface IGenericAxiosService<TResponse = any, TPayload = any> {
  url: string;
  method: AxiosMethod;
  payload?: TPayload;
  params?: Record<string, any>;
  token?: string;
  config?: AxiosRequestConfig;
}

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8080",
  timeout: 30000,
});

export async function GenericAxiosService<TResponse = any, TPayload = any>({
  url,
  method,
  payload,
  params,
  token,
  config = {},
}: IGenericAxiosService<TResponse, TPayload>): Promise<TResponse> {
  try {
    const headers: Record<string, string> = {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      ...(config.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let finalParams = { ...params };
    if (method === AXIOS_METHOD.GET) {
      finalParams = {
        ...finalParams,
        _t: Date.now(),
      };
    }

    const finalConfig: AxiosRequestConfig = {
      ...config,
      headers,
      params: finalParams,
    };

    let response;
    switch (method) {
      case AXIOS_METHOD.GET:
        response = await axiosInstance.get<TResponse>(url, finalConfig);
        break;
      case AXIOS_METHOD.PATCH:
        response = await axiosInstance.patch<TResponse>(
          url,
          payload,
          finalConfig,
        );
        break;
      case AXIOS_METHOD.POST:
        response = await axiosInstance.post<TResponse>(
          url,
          payload,
          finalConfig,
        );
        break;
      case AXIOS_METHOD.PUT:
        response = await axiosInstance.put<TResponse>(
          url,
          payload,
          finalConfig,
        );
        break;
      case AXIOS_METHOD.DELETE:
        response = await axiosInstance.delete<TResponse>(url, finalConfig);
        break;
      default:
        throw new Error(`Unsupported method: ${method as string}`);
    }
    return response.data;
  } catch (error) {
    console.info(`Error executing axios:`, error);
    throw error;
  }
}
