import { useState } from "react";

export interface HistoryEntry {
  realRate: number;
  isOverride: boolean;
  overrideRate: number;
  initialAmount: string;
  fromCurrency: string;
  convertedAmount: string;
  toCurrency: string;
}

/**
 * Custom hook to manage conversion history.
 * Keeps the last 5 entries.
 */
export const useConversionHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const addToHistory = (entry: HistoryEntry) => {
    setHistory((prev) => {
      const newHistory = [entry, ...prev];
      if (newHistory.length > 5) {
        return newHistory.slice(0, 5);
      }
      return newHistory;
    });
  };

  return { history, addToHistory };
};
