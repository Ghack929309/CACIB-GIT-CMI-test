import React, { useState, useEffect, useRef } from "react";
import { useFxRate } from "../hooks/useFxRate";
import { useConversionHistory } from "../hooks/useConversionHistory";
import HistoryTable from "./HistoryTable";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { RefreshCcw, TrendingUp, TrendingDown, Settings } from "lucide-react";
import { cn } from "../lib/utils";

type Currency = "EUR" | "USD";

const ConverterCard = () => {
  const { rate: realFxRate, trend } = useFxRate();
  const { history, addToHistory } = useConversionHistory();

  const [amount, setAmount] = useState("1");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [overrideRate, setOverrideRate] = useState("");
  const [isOverrideActive, setIsOverrideActive] = useState(false);
  const [overrideError, setOverrideError] = useState("");

  const effectiveRate =
    isOverrideActive && overrideRate ? parseFloat(overrideRate) : realFxRate;

  const prevRealRateRef = useRef(realFxRate);

  // 1. Monitor <2% deviation rule
  useEffect(() => {
    if (isOverrideActive && overrideRate) {
      const override = parseFloat(overrideRate);
      const deviation = Math.abs(override - realFxRate) / realFxRate;
      if (deviation > 0.02) {
        setIsOverrideActive(false);
        setOverrideError(
          `Override disabled: >2% deviation from Real Rate (${realFxRate.toFixed(
            4
          )})`
        );
      }
    }
    prevRealRateRef.current = realFxRate;
  }, [realFxRate, isOverrideActive, overrideRate]);

  const isEurToUsd = currency === "EUR";
  const convertedValue = isEurToUsd
    ? parseFloat(amount || "0") * effectiveRate
    : parseFloat(amount || "0") / effectiveRate;

  const formattedConverted = isNaN(convertedValue)
    ? "0.00"
    : convertedValue.toFixed(2);

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      addToHistory({
        realRate: realFxRate,
        isOverride: isOverrideActive,
        overrideRate: parseFloat(overrideRate) || 0,
        initialAmount: amount,
        fromCurrency: currency,
        convertedAmount: formattedConverted,
        toCurrency: isEurToUsd ? "USD" : "EUR",
      });
    }
  }, [realFxRate]);

  const toggleCurrency = () => {
    const formerOutput = formattedConverted;
    setAmount(formerOutput);
    setCurrency((prev) => (prev === "EUR" ? "USD" : "EUR"));
  };

  const handleOverrideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOverrideRate(value);
    setOverrideError("");

    if (value === "") {
      setIsOverrideActive(false);
      return;
    }

    const val = parseFloat(value);
    if (!isNaN(val) && val > 0) {
      const deviation = Math.abs(val - realFxRate) / realFxRate;
      if (deviation <= 0.02) {
        setIsOverrideActive(true);
      } else {
        setIsOverrideActive(false);
        setOverrideError(
          `Cannot activate: >2% deviation from Real Rate (${realFxRate.toFixed(
            4
          )})`
        );
      }
    } else {
      setIsOverrideActive(false);
      setOverrideError("Invalid number for override rate");
    }
  };

  return (
    <div className="w-full max-w-lg space-y-4">
      <Card className="w-full shadow-lg transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <RefreshCcw className="w-6 h-6" />
            FX Converter
          </CardTitle>
          <Badge
            variant="secondary"
            className="font-mono text-sm px-3 py-1 flex items-center gap-1"
          >
            Real Rate:{" "}
            <span className="ml-1 font-bold">{realFxRate.toFixed(4)}</span>
            {trend === "up" && (
              <TrendingUp className="w-4 h-4 text-green-600 ml-1" />
            )}
            {trend === "down" && (
              <TrendingDown className="w-4 h-4 text-red-600 ml-1" />
            )}
          </Badge>
        </CardHeader>

        <CardContent className="grid gap-6">
          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Amount ({currency})
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg font-medium"
                placeholder="Enter amount"
              />
            </div>

            <div className="flex items-end pb-0.5">
              <Button
                variant="default"
                size="icon"
                onClick={toggleCurrency}
                className="rounded-full h-10 w-10 shrink-0"
                title="Switch Currency"
              >
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Result ({isEurToUsd ? "USD" : "EUR"})
              </label>
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-lg font-bold text-muted-foreground">
                {formattedConverted}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border p-4 bg-muted/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <label className="text-sm font-medium">Override FX Rate</label>
              </div>
              {isOverrideActive && <Badge variant="success">Active</Badge>}
            </div>
            <div className="space-y-2">
              <Input
                type="number"
                step="0.0001"
                placeholder={`e.g. ${realFxRate.toFixed(4)}`}
                value={overrideRate}
                onChange={handleOverrideChange}
                className={cn(
                  isOverrideActive
                    ? "border-green-500 ring-1 ring-green-500"
                    : ""
                )}
              />
              {overrideError && (
                <p className="text-xs font-medium text-destructive">
                  {overrideError}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <HistoryTable history={history} />
    </div>
  );
};

export default ConverterCard;
