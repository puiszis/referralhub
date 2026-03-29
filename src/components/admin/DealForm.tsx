"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { slugify, parseTags } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  iconEmoji: string;
}

interface DealData {
  id?: string;
  title: string;
  slug: string;
  storeName: string;
  storeUrl: string;
  referralUrl: string;
  referralCode: string;
  categoryId: string;
  descriptionShort: string;
  descriptionLong: string;
  creditType: string;
  creditValueUser: number;
  creditValueOperator: number;
  imageEmoji: string;
  tags: string;
  featured: boolean;
  status: string;
  expiresAt: string;
  source: string;
  notes: string;
}

const defaultDeal: DealData = {
  title: "",
  slug: "",
  storeName: "",
  storeUrl: "",
  referralUrl: "",
  referralCode: "",
  categoryId: "",
  descriptionShort: "",
  descriptionLong: "",
  creditType: "",
  creditValueUser: 0,
  creditValueOperator: 0,
  imageEmoji: "🔗",
  tags: "[]",
  featured: false,
  status: "draft",
  expiresAt: "",
  source: "manual",
  notes: "",
};

export default function DealForm({ initialData }: { initialData?: DealData & { category?: Category } }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [form, setForm] = useState<DealData>(() => {
    if (initialData) {
      return {
        ...defaultDeal,
        ...initialData,
        categoryId: initialData.categoryId || initialData.category?.id || "",
        expiresAt: initialData.expiresAt ? new Date(initialData.expiresAt).toISOString().split("T")[0] : "",
      };
    }
    return defaultDeal;
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    setTagInput(parseTags(form.tags).join(", "));
  }, [form.tags]);

  const update = (field: keyof DealData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (title: string) => {
    update("title", title);
    if (!initialData) update("slug", slugify(title));
  };

  const handleSave = async (publishStatus?: string) => {
    setSaving(true);
    const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = {
      ...form,
      tags,
      status: publishStatus || form.status,
      expiresAt: form.expiresAt || null,
    };

    try {
      const url = initialData?.id ? `/api/admin/deals/${initialData.id}` : "/api/admin/deals";
      const method = initialData?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/admin/deals");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save deal");
      }
    } catch {
      alert("Failed to save deal");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-earth-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Title *</label>
            <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="input-field" placeholder="e.g., Garmin Fenix 8 — $50 Off Your First Order" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Slug</label>
              <input value={form.slug} onChange={(e) => update("slug", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Store Name *</label>
              <input value={form.storeName} onChange={(e) => update("storeName", e.target.value)} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Store URL</label>
              <input value={form.storeUrl} onChange={(e) => update("storeUrl", e.target.value)} className="input-field" placeholder="https://store.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Referral URL *</label>
              <input value={form.referralUrl} onChange={(e) => update("referralUrl", e.target.value)} className="input-field" placeholder="https://store.com/?ref=CODE" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Referral Code</label>
              <input value={form.referralCode} onChange={(e) => update("referralCode", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Category *</label>
              <select value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)} className="input-field">
                <option value="">Select category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.iconEmoji} {c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Short Description * (160 chars)</label>
            <textarea value={form.descriptionShort} onChange={(e) => update("descriptionShort", e.target.value)} className="input-field" rows={2} maxLength={160} />
            <p className="text-xs text-earth-400 mt-1">{form.descriptionShort.length}/160</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Long Description (Markdown)</label>
            <textarea value={form.descriptionLong} onChange={(e) => update("descriptionLong", e.target.value)} className="input-field font-mono text-sm" rows={10} placeholder="Write 2-3 editorial paragraphs..." />
          </div>
        </div>

        {/* Credit Details */}
        <div className="bg-white rounded-xl border border-earth-100 p-6 space-y-5">
          <h3 className="font-serif text-lg font-bold text-earth-900">Credit Details</h3>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Credit Type Description</label>
            <input value={form.creditType} onChange={(e) => update("creditType", e.target.value)} className="input-field" placeholder='e.g., "$50 off for you, $25 credit for me"' />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">User Credit Value ($)</label>
              <input type="number" step="0.01" value={form.creditValueUser} onChange={(e) => update("creditValueUser", parseFloat(e.target.value) || 0)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Operator Credit Value ($)</label>
              <input type="number" step="0.01" value={form.creditValueOperator} onChange={(e) => update("creditValueOperator", parseFloat(e.target.value) || 0)} className="input-field" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-earth-100 p-6">
          <label className="block text-sm font-medium text-earth-700 mb-1">Internal Notes</label>
          <textarea value={form.notes || ""} onChange={(e) => update("notes", e.target.value)} className="input-field" rows={3} placeholder="Private notes about this deal..." />
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Publish */}
        <div className="bg-white rounded-xl border border-earth-100 p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-earth-900">Publish</h3>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Status</label>
            <select value={form.status} onChange={(e) => update("status", e.target.value)} className="input-field">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="rounded border-earth-300" />
            <label htmlFor="featured" className="text-sm text-earth-700">Featured deal</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Expires At</label>
            <input type="date" value={form.expiresAt} onChange={(e) => update("expiresAt", e.target.value)} className="input-field" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleSave("draft")} disabled={saving} className="btn-secondary flex-1 text-sm disabled:opacity-50">
              Save Draft
            </button>
            <button onClick={() => handleSave("active")} disabled={saving} className="btn-primary flex-1 text-sm disabled:opacity-50">
              {saving ? "Saving..." : "Publish"}
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-xl border border-earth-100 p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-earth-900">Appearance</h3>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Emoji Icon</label>
            <input value={form.imageEmoji} onChange={(e) => update("imageEmoji", e.target.value)} className="input-field text-2xl text-center" maxLength={4} />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Tags (comma separated)</label>
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="input-field" placeholder="golf, outdoor, gear" />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Source</label>
            <select value={form.source} onChange={(e) => update("source", e.target.value)} className="input-field">
              <option value="manual">Manual</option>
              <option value="scraped">Scraped</option>
              <option value="submitted">User Submitted</option>
            </select>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-xl border border-earth-100 p-6">
          <h3 className="font-serif text-lg font-bold text-earth-900 mb-3">Preview</h3>
          <div className="deal-card">
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">{form.imageEmoji}</span>
                {form.featured && <span className="badge-green text-[10px]">Featured</span>}
              </div>
              <h4 className="font-serif font-bold text-earth-900 text-sm mb-1">{form.title || "Deal Title"}</h4>
              <p className="text-xs text-earth-400 mb-2">{form.storeName || "Store"}</p>
              <p className="text-xs text-earth-600">{form.descriptionShort || "Short description..."}</p>
              {form.creditType && (
                <div className="bg-olive-50 rounded px-2 py-1 mt-2">
                  <p className="text-[10px] font-semibold text-olive-700">{form.creditType}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
