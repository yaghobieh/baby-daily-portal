import { useState, useCallback } from 'react';

export interface ApiCallState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export const useApiCall = <T, P extends unknown[]>(
  apiFn: (...args: P) => Promise<T>
) => {
  const [state, setState] = useState<ApiCallState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: P): Promise<T> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const result = await apiFn(...args);
        setState({ data: result, isLoading: false, error: null });
        return result;
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        setState({ data: null, isLoading: false, error });
        throw error;
      }
    },
    [apiFn]
  );

  return { ...state, execute };
};
