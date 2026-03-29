import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://referralhub.com";

  const deals = await prisma.deal.findMany({
    where: { status: "active" },
    select: { slug: true, dateModified: true },
  });

  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  });

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...deals.map((deal) => ({
      url: `${baseUrl}/deals/${deal.slug}`,
      lastModified: deal.dateModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...categories.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
