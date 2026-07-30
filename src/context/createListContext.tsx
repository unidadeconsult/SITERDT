import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface ListContextValue<T> {
  items: T[];
  loading: boolean;
  refetch: () => void;
}

export function createListContext<T>(apiUrl: string, fallback: T[]) {
  const Ctx = createContext<ListContextValue<T> | null>(null);

  function Provider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<T[]>(fallback);
    const [loading, setLoading] = useState(true);

    const fetchItems = useCallback(() => {
      setLoading(true);
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setItems(data);
        })
        .catch(() => {
          /* keep fallback data if the API is unreachable */
        })
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
      fetchItems();
    }, [fetchItems]);

    return <Ctx.Provider value={{ items, loading, refetch: fetchItems }}>{children}</Ctx.Provider>;
  }

  function useListContext() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useListContext must be used within its Provider');
    return ctx;
  }

  return { Provider, useListContext };
}
