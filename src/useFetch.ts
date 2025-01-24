import { useEffect, useRef, useState } from "react";
import { UseFetchParams, UseFetchReturn } from "./types/useFetchTypes";
import { buildQueryString, generateCacheKey } from "./utils";

const cache: Record<string, any> = {};

export const useFetch = <T>({
  baseUrl,
  method,
  endpoint,
  query,
  json = true,
  abortController = false,
  headers = { "Content-Type": "application/json" },
  body,
  experimentalCaching = false,
}: UseFetchParams): UseFetchReturn<T> => {
  const [data, setData] = useState<T | Response | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const controllerRef = useRef<AbortController>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const cacheKey = generateCacheKey(method, baseUrl, endpoint, query!);

        if (experimentalCaching && cache[cacheKey]) {
          setData(cache[cacheKey]);
          setIsLoading(false);
          return;
        }

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
          ...(abortController && { signal }),
        };

        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        let result: any;
        if (json) {
          result = await response.json();
        } else {
          result = response;
        }

        if (experimentalCaching) {
          cache[cacheKey] = result;
        }

        setData(result);
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
