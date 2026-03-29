"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  coverEmoji: string;
}

export default function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/posts").then((r) => r.json()).then(setPosts).finally(() => setLoading(false));
  }, []);

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (res.ok) setPosts(posts.filter((p) => p.id !== id));
  };

  if (loading) return <div className="text-earth-400">Loading posts...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-earth-900">Blog Posts</h1>
        <Link href="/admin/posts/new" className="btn-primary text-sm">New Post</Link>
      </div>

      <div className="bg-white rounded-xl border border-earth-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-earth-100 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-earth-400">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-earth-400">Title</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-earth-400 hidden md:table-cell">Published</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-earth-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-earth-50 hover:bg-earth-50/50">
                  <td className="px-4 py-3">
                    <span className={`w-3 h-3 rounded-full inline-block ${post.status === "published" ? "bg-green-500" : "bg-gray-400"}`} />
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/posts/${post.id}/edit`} className="font-medium text-earth-800 hover:text-olive-700">
                      {post.coverEmoji} {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-earth-500 hidden md:table-cell">
                    {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/posts/${post.id}/edit`} className="text-olive-600 hover:text-olive-800 text-xs font-medium">Edit</Link>
                      {post.status === "published" && (
                        <Link href={`/blog/${post.slug}`} target="_blank" className="text-blue-600 hover:text-blue-800 text-xs font-medium">View</Link>
                      )}
                      <button onClick={() => deletePost(post.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {posts.length === 0 && (
          <div className="text-center py-10 text-earth-400">
            No posts yet. <Link href="/admin/posts/new" className="text-olive-600 hover:underline">Create your first post</Link>
          </div>
        )}
      </div>
    </div>
  );
}
