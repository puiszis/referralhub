"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Analytics {
  totalActiveDeals: number;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
  estimatedRevenue: number;
  topDeals: Array<{ id: string; title: string; slug: string; clickCount: number; storeName: string }>;
  dailyClicks: Array<{ date: string; count: number }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-earth-400">Loading dashboard...</div>;
  if (!data) return <div className="text-red-600">Failed to load analytics.</div>;

  const maxClicks = Math.max(...data.dailyClicks.map((d) => d.count), 1);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-earth-900">Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/admin/deals/new" className="btn-primary text-sm">Add Deal</Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Deals", value: data.totalActiveDeals, icon: "🏷️" },
          { label: "Clicks Today", value: data.clicksToday, icon: "🖱️" },
          { label: "Clicks This Month", value: data.clicksThisMonth, icon: "📈" },
          { label: "Est. Revenue", value: `$${data.estimatedRevenue}`, icon: "💰" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-earth-100 p-5">
            <div className="flex items-center gap-2 mb-1">
              <span>{stat.icon}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-earth-400">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-earth-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Click Trend Chart */}
      <div className="bg-white rounded-xl border border-earth-100 p-6">
        <h2 className="font-serif text-lg font-bold text-earth-900 mb-4">Clicks — Last 30 Days</h2>
        <div className="flex items-end gap-1 h-40">
          {data.dailyClicks.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center group relative">
              <div
                className="w-full bg-olive-200 hover:bg-olive-400 rounded-t transition-colors min-h-[2px]"
                style={{ height: `${(d.count / maxClicks) * 100}%` }}
              />
              <div className="hidden group-hover:block absolute bottom-full mb-1 bg-earth-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                {d.date}: {d.count} clicks
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-earth-400 mt-2">
          <span>{data.dailyClicks[0]?.date}</span>
          <span>{data.dailyClicks[data.dailyClicks.length - 1]?.date}</span>
        </div>
      </div>

      {/* Top Deals */}
      <div className="bg-white rounded-xl border border-earth-100 p-6">
        <h2 className="font-serif text-lg font-bold text-earth-900 mb-4">Top Deals by Clicks</h2>
        <div className="space-y-3">
          {data.topDeals.map((deal, i) => (
            <div key={deal.id} className="flex items-center justify-between py-2 border-b border-earth-50 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-earth-300 w-6">{i + 1}</span>
                <div>
                  <Link href={`/admin/deals/${deal.id}/edit`} className="text-sm font-medium text-earth-800 hover:text-olive-700">
                    {deal.title}
                  </Link>
                  <p className="text-xs text-earth-400">{deal.storeName}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-earth-600">{deal.clickCount} clicks</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
