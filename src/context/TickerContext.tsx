import { createListContext } from './createListContext';
import { liveMatches } from '../data/mockData';
import type { LiveMatch } from '../types';

const { Provider, useListContext } = createListContext<LiveMatch>('/api/ticker', liveMatches);

export const TickerProvider = Provider;
export const useTicker = useListContext;
