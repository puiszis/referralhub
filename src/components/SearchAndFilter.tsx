"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  iconEmoji: string;
}

export default function SearchAndFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("q") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentCategory = searchParams.get("category") || "";
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearchChange = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParams("q", value), 300);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search deals, stores, tags..."
            defaultValue={currentSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={currentSort}
          onChange={(e) => updateParams("sort", e.target.value)}
          className="input-field sm:w-48"
        >
          <option value="newest">Newest</option>
          <option value="featured">Featured First</option>
          <option value="expiring">Expiring Soon</option>
          <option value="popular">Most Clicked</option>
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        <button
          onClick={() => updateParams("category", "")}
          className={currentCategory === "" ? "category-pill-active" : "category-pill"}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => updateParams("category", cat.slug)}
            className={currentCategory === cat.slug ? "category-pill-active" : "category-pill"}
          >
            <span>{cat.iconEmoji}</span>
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
