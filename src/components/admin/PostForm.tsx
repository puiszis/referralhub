"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { slugify, parseTags } from "@/lib/utils";

interface Deal {
  id: string;
  title: string;
  slug: string;
  storeName: string;
  imageEmoji: string;
  status: string;
}

interface PostData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverEmoji: string;
  status: string;
  tags: string;
  dealSlugs: string;
  seoTitle: string;
  seoDescription: string;
}

const defaultPost: PostData = {
  title: "", slug: "", excerpt: "", content: "", coverEmoji: "🎃",
  status: "draft", tags: "[]", dealSlugs: "[]", seoTitle: "", seoDescription: "",
};

export default function PostForm({ initialData }: { initialData?: PostData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [dealSearch, setDealSearch] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [form, setForm] = useState<PostData>(() => initialData ? { ...defaultPost, ...initialData } : defaultPost);

  const selectedSlugs = parseTags(form.dealSlugs);

  useEffect(() => {
    fetch("/api/admin/deals").then((r) => r.json()).then(setDeals);
  }, []);

  useEffect(() => {
    setTagInput(parseTags(form.tags).join(", "));
  }, [form.tags]);

  const update = (field: keyof PostData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (title: string) => {
    update("title", title);
    if (!initialData) update("slug", slugify(title));
  };

  const toggleDeal = (slug: string) => {
    const current = parseTags(form.dealSlugs);
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    update("dealSlugs", JSON.stringify(next));
  };

  const handleSave = async (publishStatus?: string) => {
    setSaving(true);
    const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = {
      ...form,
      tags,
      dealSlugs: parseTags(form.dealSlugs),
      status: publishStatus || form.status,
    };

    const url = initialData?.id ? `/api/admin/posts/${initialData.id}` : "/api/admin/posts";
    const method = initialData?.id ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) router.push("/admin/posts");
      else { const err = await res.json(); alert(err.error || "Failed to save"); }
    } catch { alert("Failed to save post"); }
    finally { setSaving(false); }
  };

  const filteredDeals = deals.filter((d) =>
    d.status === "active" && (
      !dealSearch ||
      d.title.toLowerCase().includes(dealSearch.toLowerCase()) ||
      d.storeName.toLowerCase().includes(dealSearch.toLowerCase())
    )
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main editor */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-earth-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Title *</label>
            <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="input-field"
              placeholder="e.g., Spooky Halloween Bash — Complete Party Guide" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Slug</label>
              <input value={form.slug} onChange={(e) => update("slug", e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Cover Emoji</label>
              <input value={form.coverEmoji} onChange={(e) => update("coverEmoji", e.target.value)}
                className="input-field text-2xl text-center" maxLength={4} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Excerpt * (shown in card previews)</label>
            <textarea value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)}
              className="input-field" rows={2} maxLength={500} placeholder="A brief description of this party guide..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Content *</label>
            <p className="text-xs text-earth-400 mb-2">
              Use ## for headings, ### for subheadings, - for bullet lists. Separate paragraphs with blank lines.
            </p>
            <textarea value={form.content} onChange={(e) => update("content", e.target.value)}
              className="input-field font-mono text-sm" rows={20}
              placeholder={"Every great Halloween party starts with the right atmosphere...\n\n## Decorations\n\nYou'll need a few key pieces to set the mood:\n\n- Black and orange balloon arch\n- LED cobweb string lights\n- Fog machine (the #1 game-changer)\n\n## Food & Drink\n\n### The Witch's Punch Bowl\n\nThis crowd-pleaser takes 5 minutes to make..."} />
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl border border-earth-100 p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-earth-900">SEO</h3>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">SEO Title</label>
            <input value={form.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} className="input-field"
              placeholder="Custom title tag (defaults to post title)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">SEO Description</label>
            <textarea value={form.seoDescription} onChange={(e) => update("seoDescription", e.target.value)}
              className="input-field" rows={2} placeholder="Meta description for search engines" />
          </div>
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
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Tags (comma separated)</label>
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="input-field"
              placeholder="halloween, party-planning, diy" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleSave("draft")} disabled={saving}
              className="btn-secondary flex-1 text-sm disabled:opacity-50">Save Draft</button>
            <button onClick={() => handleSave("published")} disabled={saving}
              className="btn-primary flex-1 text-sm disabled:opacity-50">
              {saving ? "Saving..." : "Publish"}
            </button>
          </div>
        </div>

        {/* Deal Embedder */}
        <div className="bg-white rounded-xl border border-earth-100 p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-earth-900">Embed Deals</h3>
          <p className="text-xs text-earth-400">
            Selected deals will appear as a &quot;Supplies for This Party&quot; section at the bottom of the post.
          </p>

          {selectedSlugs.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-earth-500 uppercase">Selected ({selectedSlugs.length})</p>
              {selectedSlugs.map((slug) => {
                const d = deals.find((dl) => dl.slug === slug);
                return (
                  <div key={slug} className="flex items-center justify-between bg-earth-50 px-3 py-2 rounded-lg">
                    <span className="text-sm text-earth-700">{d ? `${d.imageEmoji} ${d.title}` : slug}</span>
                    <button onClick={() => toggleDeal(slug)} className="text-red-500 text-xs hover:text-red-700">Remove</button>
                  </div>
                );
              })}
            </div>
          )}

          <input value={dealSearch} onChange={(e) => setDealSearch(e.target.value)} className="input-field"
            placeholder="Search deals to embed..." />

          <div className="max-h-60 overflow-y-auto space-y-1">
            {filteredDeals.map((deal) => {
              const isSelected = selectedSlugs.includes(deal.slug);
              return (
                <button key={deal.id} onClick={() => toggleDeal(deal.slug)}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isSelected ? "bg-olive-50 text-olive-700 border border-olive-200" : "hover:bg-earth-50 text-earth-600"
                  }`}>
                  <span>{deal.imageEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{deal.title}</p>
                    <p className="text-xs text-earth-400">{deal.storeName}</p>
                  </div>
                  {isSelected && <span className="text-olive-600 text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
