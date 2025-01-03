export type FetcherConfig<K> = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: K;
  timeout?: number;
  headers?: HeadersInit;
  token?: string | null;
  urlSearchParams?: string | Record<string, string>;
};

export const fetcher = async <T, K = undefined>(
  config: FetcherConfig<K>
): Promise<T> => {
  try {
    const {
      method = 'GET',
      body = {},
      headers = {},
      timeout = 5000,
      urlSearchParams,
      token,
    } = config;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(method !== 'GET' && { body: JSON.stringify(body) }),
      signal: controller.signal,
    };

    let url = config.url;
    if (urlSearchParams) {
      const searchParams = new URLSearchParams();
      Object.entries(urlSearchParams).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value);
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url, options);
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
};
