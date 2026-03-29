"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostForm from "@/components/admin/PostForm";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/posts/${id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-earth-400">Loading post...</div>;
  if (!post) return <div className="text-red-600">Post not found.</div>;

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-earth-900 mb-6">Edit Blog Post</h1>
      <PostForm initialData={post} />
    </div>
  );
}
