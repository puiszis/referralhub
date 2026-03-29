"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface LinkResult {
  id: string;
  title: string;
  slug: string;
  storeName: string;
  referralUrl: string;
  status: string;
  lastCheck: {
    checkedAt: string;
    statusCode: number;
    responseTimeMs: number;
    isHealthy: boolean;
    errorMessage: string | null;
  } | null;
}

interface HealthData {
  results: LinkResult[];
  summary: { healthy: number; broken: number; unchecked: number; total: number };
}

export default function LinkHealthPage() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const loadData = () => {
    fetch("/api/admin/link-health")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const runCheck = async () => {
    setRunning(true);
    await fetch("/api/admin/link-health/run", { method: "POST" });
    loadData();
    setRunning(false);
  };

  if (loading) return <div className="text-earth-400">Loading link health...</div>;
  if (!data) return <div className="text-red-600">Failed to load data.</div>;

  const statusIcon = (result: LinkResult) => {
    if (!result.lastCheck) return "⏸";
    if (result.lastCheck.isHealthy) return "✅";
    if (result.lastCheck.statusCode >= 300 && result.lastCheck.statusCode < 400) return "⚠️";
    return "❌";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-earth-900">Link Health</h1>
        <button onClick={runCheck} disabled={running} className="btn-primary text-sm disabled:opacity-50">
          {running ? "Checking..." : "Check All Now"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-earth-100 p-4">
          <p className="text-xs text-earth-400 uppercase font-semibold">Total</p>
          <p className="text-xl font-bold text-earth-900">{data.summary.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-green-100 p-4">
          <p className="text-xs text-green-600 uppercase font-semibold">Healthy</p>
          <p className="text-xl font-bold text-green-700">{data.summary.healthy}</p>
        </div>
        <div className="bg-white rounded-xl border border-red-100 p-4">
          <p className="text-xs text-red-600 uppercase font-semibold">Broken</p>
          <p className="text-xl font-bold text-red-700">{data.summary.broken}</p>
        </div>
        <div className="bg-white rounded-xl border border-earth-100 p-4">
          <p className="text-xs text-earth-400 uppercase font-semibold">Unchecked</p>
          <p className="text-xl font-bold text-earth-500">{data.summary.unchecked}</p>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-earth-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-earth-100">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-earth-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-earth-400">Deal</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-earth-400 hidden md:table-cell">Store</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-earth-400 hidden lg:table-cell">HTTP Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-earth-400 hidden lg:table-cell">Response Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-earth-400 hidden md:table-cell">Last Checked</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-earth-400">Error</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((result) => (
                <tr key={result.id} className="border-b border-earth-50 hover:bg-earth-50/50">
                  <td className="px-4 py-3">{statusIcon(result)}</td>
                  <td className="px-4 py-3 font-medium text-earth-800">{result.title}</td>
                  <td className="px-4 py-3 text-earth-500 hidden md:table-cell">{result.storeName}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {result.lastCheck ? (
                      <span className={result.lastCheck.isHealthy ? "text-green-600" : "text-red-600"}>
                        {result.lastCheck.statusCode || "N/A"}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-earth-500 hidden lg:table-cell">
                    {result.lastCheck ? `${result.lastCheck.responseTimeMs}ms` : "—"}
                  </td>
                  <td className="px-4 py-3 text-earth-500 hidden md:table-cell">
                    {result.lastCheck ? formatDate(result.lastCheck.checkedAt) : "Never"}
                  </td>
                  <td className="px-4 py-3 text-xs text-red-500 max-w-[200px] truncate">
                    {result.lastCheck?.errorMessage || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
