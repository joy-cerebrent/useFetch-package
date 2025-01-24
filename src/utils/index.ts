// fetchUtils.ts

export const buildQueryString = (query: Record<string, string | number | boolean>): string => {
  if (!query) return "";

  const queryParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    queryParams.append(key, value.toString());
  });

  return queryParams.toString() ? `${queryParams.toString()}` : "";
};

export const generateCacheKey = (
  method: string,
  baseUrl: string,
  endpoint: string,
  query: Record<string, string | number | boolean>
): string => {
  const queryString = buildQueryString(query);
  return `${method}:${baseUrl}${endpoint}?${queryString}`;
};
