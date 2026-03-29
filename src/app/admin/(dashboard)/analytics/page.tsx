"use client";

import { useEffect, useState } from "react";

interface Analytics {
  totalActiveDeals: number;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
  estimatedRevenue: number;
  topDeals: Array<{ id: string; title: string; storeName: string; clickCount: number; creditValueOperator: number }>;
  dailyClicks: Array<{ date: string; count: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  categoryBreakdown: Array<{ category: string; count: number }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-earth-400">Loading analytics...</div>;
  if (!data) return <div className="text-red-600">Failed to load analytics.</div>;

  const maxDaily = Math.max(...data.dailyClicks.map((d) => d.count), 1);
  const maxCat = Math.max(...data.categoryBreakdown.map((d) => d.count), 1);
  const totalDevices = data.deviceBreakdown.reduce((s, d) => s + d.count, 0) || 1;

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl font-bold text-earth-900">Analytics</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today", value: data.clicksToday },
          { label: "This Week", value: data.clicksThisWeek },
          { label: "This Month", value: data.clicksThisMonth },
          { label: "Est. Revenue", value: `$${data.estimatedRevenue}` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-earth-100 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-earth-400 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-earth-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Daily Clicks Chart */}
      <div className="bg-white rounded-xl border border-earth-100 p-6">
        <h2 className="font-serif text-lg font-bold text-earth-900 mb-4">Daily Clicks (30 Days)</h2>
        <div className="flex items-end gap-1 h-48">
          {data.dailyClicks.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center group relative">
              <div
                className="w-full bg-olive-300 hover:bg-olive-500 rounded-t transition-colors min-h-[2px]"
                style={{ height: `${(d.count / maxDaily) * 100}%` }}
              />
              <div className="hidden group-hover:block absolute bottom-full mb-1 bg-earth-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                {d.date}: {d.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-earth-100 p-6">
          <h2 className="font-serif text-lg font-bold text-earth-900 mb-4">Clicks by Category</h2>
          <div className="space-y-3">
            {data.categoryBreakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-earth-700">{cat.category}</span>
                  <span className="font-medium text-earth-900">{cat.count}</span>
                </div>
                <div className="h-2 bg-earth-100 rounded-full overflow-hidden">
                  <div className="h-full bg-olive-400 rounded-full" style={{ width: `${(cat.count / maxCat) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-xl border border-earth-100 p-6">
          <h2 className="font-serif text-lg font-bold text-earth-900 mb-4">Device Breakdown</h2>
          <div className="space-y-3">
            {data.deviceBreakdown.map((d) => (
              <div key={d.device}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-earth-700 capitalize">{d.device}</span>
                  <span className="font-medium text-earth-900">{d.count} ({Math.round((d.count / totalDevices) * 100)}%)</span>
                </div>
                <div className="h-2 bg-earth-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(d.count / totalDevices) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Deals Table */}
      <div className="bg-white rounded-xl border border-earth-100 p-6">
        <h2 className="font-serif text-lg font-bold text-earth-900 mb-4">Top 10 Deals</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-earth-100">
                <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-earth-400">#</th>
                <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-earth-400">Deal</th>
                <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-earth-400">Store</th>
                <th className="text-right px-4 py-2 text-xs font-semibold uppercase text-earth-400">Clicks</th>
                <th className="text-right px-4 py-2 text-xs font-semibold uppercase text-earth-400">Est. Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.topDeals.map((deal, i) => (
                <tr key={deal.id} className="border-b border-earth-50">
                  <td className="px-4 py-2 text-earth-400">{i + 1}</td>
                  <td className="px-4 py-2 font-medium text-earth-800">{deal.title}</td>
                  <td className="px-4 py-2 text-earth-500">{deal.storeName}</td>
                  <td className="px-4 py-2 text-right font-medium">{deal.clickCount}</td>
                  <td className="px-4 py-2 text-right text-olive-700">${(deal.clickCount * deal.creditValueOperator * 0.1).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
