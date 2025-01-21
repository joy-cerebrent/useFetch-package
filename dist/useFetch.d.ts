interface UseFetchParams {
    baseUrl: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    endpoint: string;
    query?: Record<string, string | number | boolean>;
    json?: boolean;
    abortController?: boolean;
    headers?: Record<string, string>;
    body?: any;
}
interface UseFetchReturn<T> {
    data: T | Response | null;
    isLoading: boolean;
    error: Error | null;
}
export declare const useFetch: <T>({ baseUrl, method, endpoint, query, json, abortController, headers, body }: UseFetchParams) => UseFetchReturn<T>;
export {};
