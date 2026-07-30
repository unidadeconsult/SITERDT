import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { dailyPoll } from '../data/mockData';
import type { Poll } from '../types';

interface PollContextValue {
  poll: Poll;
  loading: boolean;
  refetch: () => void;
  vote: (optionId: string) => Promise<void>;
}

const PollContext = createContext<PollContextValue | null>(null);

export function PollProvider({ children }: { children: ReactNode }) {
  const [poll, setPoll] = useState<Poll>(dailyPoll);
  const [loading, setLoading] = useState(true);

  const fetchPoll = useCallback(() => {
    setLoading(true);
    fetch('/api/poll')
      .then((res) => res.json())
      .then((data) => {
        if (data?.question) setPoll(data);
      })
      .catch(() => {
        /* keep fallback poll if the API is unreachable */
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  const vote = useCallback(async (optionId: string) => {
    const res = await fetch('/api/poll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId }),
    });
    const data = await res.json();
    if (data?.poll) setPoll(data.poll);
  }, []);

  return (
    <PollContext.Provider value={{ poll, loading, refetch: fetchPoll, vote }}>
      {children}
    </PollContext.Provider>
  );
}

export function usePoll() {
  const ctx = useContext(PollContext);
  if (!ctx) throw new Error('usePoll must be used within a PollProvider');
  return ctx;
}
