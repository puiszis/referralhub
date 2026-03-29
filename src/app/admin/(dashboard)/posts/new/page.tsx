"use client";

import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-earth-900 mb-6">New Blog Post</h1>
      <PostForm />
    </div>
  );
}
