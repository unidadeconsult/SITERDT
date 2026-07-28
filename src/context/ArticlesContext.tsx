import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Article } from '../types';
import { articles as fallbackArticles } from '../data/mockData';

interface ArticlesContextValue {
  articles: Article[];
  loading: boolean;
  refetch: () => void;
}

const ArticlesContext = createContext<ArticlesContextValue | null>(null);

export function ArticlesProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(fallbackArticles);
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(() => {
    setLoading(true);
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setArticles(data);
      })
      .catch(() => {
        /* keep fallback mock articles if the API is unreachable */
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <ArticlesContext.Provider value={{ articles, loading, refetch: fetchArticles }}>
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticles() {
  const ctx = useContext(ArticlesContext);
  if (!ctx) throw new Error('useArticles must be used within an ArticlesProvider');
  return ctx;
}
