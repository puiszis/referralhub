"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Deal {
  id: string;
  title: string;
  slug: string;
  storeName: string;
  status: string;
  clickCount: number;
  featured: boolean;
  expiresAt: string | null;
  dateAdded: string;
  category: { name: string };
}

export default function DealsManager() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetch("/api/admin/deals")
      .then((r) => r.json())
      .then(setDeals)
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (deal: Deal) => {
    const newStatus = deal.status === "active" ? "paused" : "active";
    const res = await fetch(`/api/admin/deals/${deal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setDeals(deals.map((d) => (d.id === deal.id ? { ...d, status: newStatus } : d)));
    } else {
      alert("Failed to update deal status");
    }
  };

  const deleteDeal = async (id: string) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;
    const res = await fetch(`/api/admin/deals/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDeals(deals.filter((d) => d.id !== id));
    } else {
      alert("Failed to delete deal");
    }
  };

  const exportDeals = async () => {
    const res = await fetch("/api/admin/deals/export");
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `referralhub-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = deals.filter((d) => {
    if (search && !d.title.toLowerCase().includes(search.toLowerCase()) && !d.storeName.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && d.status !== statusFilter) return false;
    return true;
  });

  const statusColors: Record<string, string> = {
    active: "bg-green-500",
    draft: "bg-gray-400",
    paused: "bg-amber-500",
    expired: "bg-red-500",
    archived: "bg-earth-300",
  };

  if (loading) return <div className="text-earth-400">Loading deals...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-serif text-2xl font-bold text-earth-900">Deal Manager</h1>
        <div className="flex gap-3">
          <button onClick={exportDeals} className="btn-secondary text-sm">Export JSON</button>
          <Link href="/admin/deals/new" className="btn-primary text-sm">Add Deal</Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search deals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field flex-1"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field sm:w-40">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="paused">Paused</option>
          <option value="expired">Expired</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Deals Table */}
      <div className="bg-white rounded-xl border border-earth-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-earth-100 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-earth-400">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-earth-400">Title</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-earth-400 hidden md:table-cell">Store</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-earth-400 hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-earth-400">Clicks</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-earth-400 hidden lg:table-cell">Expires</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-earth-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((deal) => (
                <tr key={deal.id} className="border-b border-earth-50 hover:bg-earth-50/50">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(deal)}
                      title={`Status: ${deal.status}. Click to toggle.`}
                      className={`w-3 h-3 rounded-full ${statusColors[deal.status] || "bg-gray-300"}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/deals/${deal.id}/edit`} className="font-medium text-earth-800 hover:text-olive-700">
                      {deal.title}
                    </Link>
                    {deal.featured && <span className="ml-2 badge-green text-[10px]">Featured</span>}
                  </td>
                  <td className="px-4 py-3 text-earth-500 hidden md:table-cell">{deal.storeName}</td>
                  <td className="px-4 py-3 text-earth-500 hidden md:table-cell">{deal.category.name}</td>
                  <td className="px-4 py-3 font-medium text-earth-700">{deal.clickCount}</td>
                  <td className="px-4 py-3 text-earth-500 hidden lg:table-cell">
                    {deal.expiresAt ? formatDate(deal.expiresAt) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/deals/${deal.id}/edit`} className="text-olive-600 hover:text-olive-800 text-xs font-medium">
                        Edit
                      </Link>
                      <button onClick={() => deleteDeal(deal.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-earth-400">No deals found.</div>
        )}
      </div>
    </div>
  );
}
