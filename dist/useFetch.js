import { useEffect, useRef, useState } from "react";
;
export const useFetch = ({ baseUrl, method, endpoint, query, json = true, abortController = false, headers = { "Content-Type": "application/json" }, body }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const controllerRef = useRef(null);
    const buildQueryString = (query) => {
        if (!query)
            return "";
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
                const url = `${baseUrl}${endpoint}?${buildQueryString(query)}`;
                if (controllerRef.current) {
                    controllerRef.current.abort();
                }
                controllerRef.current = new AbortController();
                const signal = controllerRef.current.signal;
                const options = {
                    method,
                    headers,
                    ...(body && { body: JSON.stringify(body) }),
                    ...(abortController && { signal })
                };
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
                if (json) {
                    const result = await response.json();
                    setData(result);
                }
                else {
                    setData(response);
                }
            }
            catch (error) {
                setError(error);
            }
            finally {
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
