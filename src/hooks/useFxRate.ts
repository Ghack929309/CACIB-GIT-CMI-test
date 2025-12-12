import { useState, useEffect } from "react";

export type Trend = "up" | "down" | "neutral";

/**
 * hook to manage real-time FX rate.
 */
export const useFxRate = (
  initialRate: number = 1.1
): { rate: number; trend: Trend } => {
  const [rate, setRate] = useState<number>(initialRate);
  const [trend, setTrend] = useState<Trend>("neutral");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRate((prevRate) => {
        const fluctuation = Math.random() * 0.1 - 0.05;
        const newRate = parseFloat(
          Math.max(0.01, prevRate + fluctuation).toFixed(4)
        );

        if (newRate > prevRate) {
          setTrend("up");
        } else if (newRate < prevRate) {
          setTrend("down");
        } else {
          setTrend("neutral"); // If newRate === prevRate
        }

        return newRate;
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [initialRate]);

  return { rate, trend };
};
