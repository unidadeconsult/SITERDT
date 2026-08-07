import { createListContext } from './createListContext';
import { transfers } from '../data/mockData';
import type { Transfer } from '../types';

const { Provider, useListContext } = createListContext<Transfer>('/api/transfers', transfers);

export const TransfersProvider = Provider;
export const useTransfers = useListContext;
