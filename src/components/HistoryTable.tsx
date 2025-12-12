import React from "react";
import type { HistoryEntry } from "../hooks/useConversionHistory";

interface HistoryTableProps {
  history: HistoryEntry[];
}

const HistoryTable: React.FC<HistoryTableProps> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 w-full">
      <h3 className="text-lg font-semibold text-slate-700 mb-2">History</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th className="px-4 py-2">Real Rate</th>
              <th className="px-4 py-2">Override</th>
              <th className="px-4 py-2">Initial</th>
              <th className="px-4 py-2">Converted</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => (
              <tr key={index} className="bg-white border-b hover:bg-slate-50">
                <td className="px-4 py-2">{entry.realRate.toFixed(4)}</td>
                <td className="px-4 py-2">
                  {entry.isOverride ? entry.overrideRate.toFixed(4) : "-"}
                </td>
                <td className="px-4 py-2 font-medium">
                  {entry.initialAmount} {entry.fromCurrency}
                </td>
                <td className="px-4 py-2 font-medium text-slate-900">
                  {entry.convertedAmount} {entry.toCurrency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
