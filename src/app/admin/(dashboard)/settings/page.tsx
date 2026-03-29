"use client";

import { useEffect, useState } from "react";

interface Settings {
  blogTitle: string;
  tagline: string;
  aboutContent: string;
  ftcDisclosure: string;
  operatorName: string;
  operatorEmail: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconEmoji: string;
  sortOrder: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  // New category form
  const [newCat, setNewCat] = useState({ name: "", iconEmoji: "📦", description: "" });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings);
        setCategories(data.categories || []);
        setSubscriberCount(data.subscriberCount || 0);
      })
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) showToast("Settings saved!");
    else showToast("Failed to save settings");
    setSaving(false);
  };

  const addCategory = async () => {
    if (!newCat.name) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCat),
    });
    if (res.ok) {
      const cat = await res.json();
      setCategories([...categories, cat]);
      setNewCat({ name: "", iconEmoji: "📦", description: "" });
      showToast("Category added!");
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category? Deals in this category will need to be reassigned.")) return;
    await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setCategories(categories.filter((c) => c.id !== id));
    showToast("Category deleted");
  };

  const exportData = async () => {
    const res = await fetch("/api/admin/deals/export");
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `referralhub-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-earth-400">Loading settings...</div>;
  if (!settings) return <div className="text-red-600">Failed to load settings.</div>;

  return (
    <div className="space-y-8 max-w-3xl">
      {toast && (
        <div className="fixed top-4 right-4 bg-earth-900 text-white px-4 py-2 rounded-lg text-sm z-50 shadow-lg">
          {toast}
        </div>
      )}

      <h1 className="font-serif text-2xl font-bold text-earth-900">Settings</h1>

      {/* Site Settings */}
      <div className="bg-white rounded-xl border border-earth-100 p-6 space-y-5">
        <h2 className="font-serif text-lg font-bold text-earth-900">Site Settings</h2>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">Blog Title</label>
          <input value={settings.blogTitle} onChange={(e) => setSettings({ ...settings, blogTitle: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">Tagline</label>
          <input value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">About Page Content</label>
          <textarea value={settings.aboutContent} onChange={(e) => setSettings({ ...settings, aboutContent: e.target.value })} className="input-field" rows={6} />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">FTC Disclosure</label>
          <textarea value={settings.ftcDisclosure} onChange={(e) => setSettings({ ...settings, ftcDisclosure: e.target.value })} className="input-field" rows={4} />
        </div>
      </div>

      {/* Operator Profile */}
      <div className="bg-white rounded-xl border border-earth-100 p-6 space-y-5">
        <h2 className="font-serif text-lg font-bold text-earth-900">Operator Profile</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Name</label>
            <input value={settings.operatorName} onChange={(e) => setSettings({ ...settings, operatorName: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Email</label>
            <input value={settings.operatorEmail} onChange={(e) => setSettings({ ...settings, operatorEmail: e.target.value })} className="input-field" />
          </div>
        </div>
        <button onClick={saveSettings} disabled={saving} className="btn-primary text-sm disabled:opacity-50">
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl border border-earth-100 p-6 space-y-5">
        <h2 className="font-serif text-lg font-bold text-earth-900">Categories</h2>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between py-2 px-3 bg-earth-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span>{cat.iconEmoji}</span>
                <span className="text-sm font-medium text-earth-800">{cat.name}</span>
                <span className="text-xs text-earth-400">({cat.slug})</span>
              </div>
              <button onClick={() => deleteCategory(cat.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
            </div>
          ))}
        </div>
        <div className="border-t border-earth-100 pt-4">
          <h4 className="text-sm font-medium text-earth-700 mb-2">Add Category</h4>
          <div className="flex gap-2">
            <input value={newCat.iconEmoji} onChange={(e) => setNewCat({ ...newCat, iconEmoji: e.target.value })} className="input-field w-16 text-center text-xl" maxLength={4} />
            <input value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} className="input-field flex-1" placeholder="Category name" />
            <button onClick={addCategory} className="btn-primary text-sm">Add</button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl border border-earth-100 p-6 space-y-5">
        <h2 className="font-serif text-lg font-bold text-earth-900">Data Management</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-earth-800">Newsletter Subscribers</p>
            <p className="text-xs text-earth-400">{subscriberCount} active subscribers</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={exportData} className="btn-secondary text-sm">Export All Data (JSON)</button>
        </div>
      </div>
    </div>
  );
}
