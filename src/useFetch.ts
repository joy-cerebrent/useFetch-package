import { useEffect, useRef, useState } from "react";

interface UseFetchParams {
  baseUrl: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  query?: Record<string, string | number | boolean>;
  json?: boolean,
  abortController?: boolean;
  headers?: Record<string, string>;
  body?: any;
};

interface UseFetchReturn<T> {
  data: T | Response | null;
  isLoading: boolean;
  error: Error | null;
}

export const useFetch = <T>({
  baseUrl,
  method,
  endpoint,
  query,
  json = true,
  abortController = false,
  headers = { "Content-Type": "application/json" },
  body
}: UseFetchParams): UseFetchReturn<T> => {
  const [data, setData] = useState<T | Response | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const controllerRef = useRef<AbortController>(null);

  const buildQueryString = (query: Record<string, string | number | boolean>) => {
    if (!query) return "";

    const queryParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      queryParams.append(key, value.toString());
    });

    return queryParams.toString() ? `${queryParams.toString()}` : "";
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const url = `${baseUrl}${endpoint}?${buildQueryString(query!)}`;

        if (controllerRef.current) {
          controllerRef.current.abort();
        }

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        const options: RequestInit = {
          method,
          headers,
          ...(body && { body: JSON.stringify(body) }),
          ...(abortController && { signal })
        }

        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        if (json) {
          const result: T = await response.json();
          setData(result);
        } else {
          setData(response);
        }
      } catch (error: any) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    baseUrl,
    method,
    endpoint,
    JSON.stringify(query),
    JSON.stringify(body),
    JSON.stringify(headers)
  ]);

  return { data, isLoading, error };
};