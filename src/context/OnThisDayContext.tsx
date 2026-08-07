import { createListContext } from './createListContext';
import { onThisDayFacts } from '../data/mockData';
import type { OnThisDayFact } from '../types';

const { Provider, useListContext } = createListContext<OnThisDayFact>(
  '/api/onthisday',
  onThisDayFacts
);

export const OnThisDayProvider = Provider;
export const useOnThisDay = useListContext;
