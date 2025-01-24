export type UseFetchParams = {
  baseUrl: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  query?: Record<string, string | number | boolean>;
  json?: boolean;
  abortController?: boolean;
  headers?: Record<string, string>;
  body?: any;
  experimentalCaching?: boolean;
}

export type UseFetchReturn<T> = {
  data: T | Response | null;
  isLoading: boolean;
  error: Error | null;
}
