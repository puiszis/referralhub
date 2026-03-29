"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DealForm from "@/components/admin/DealForm";

export default function EditDealPage() {
  const { id } = useParams<{ id: string }>();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/deals")
      .then((r) => r.json())
      .then((deals) => {
        const found = deals.find((d: { id: string }) => d.id === id);
        setDeal(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-earth-400">Loading deal...</div>;
  if (!deal) return <div className="text-red-600">Deal not found.</div>;

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-earth-900 mb-6">Edit Deal</h1>
      <DealForm initialData={deal} />
    </div>
  );
}
