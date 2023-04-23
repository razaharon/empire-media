import { createContext } from 'react';
import { StockData } from '../interfaces/StockData';
export const StockContext = createContext<StockData|null>(null);
