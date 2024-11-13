export type FetcherConfig<K> = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: K;
  timeout?: number;
  headers?: HeadersInit;
  urlSearchParams?: string;
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
    } = config;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...(method !== 'GET' && { body: JSON.stringify(body) }),
      signal: controller.signal,
    };

    if (urlSearchParams) {
      config.url += `?${urlSearchParams}`;
    }

    const response = await fetch(config.url, options);
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
