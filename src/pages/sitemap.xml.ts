import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getAllProperties } from "@/lib/properties";

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/'/g, "&apos;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function toDateStr(d: Date | string): string {
  return (d instanceof Date ? d : new Date(d)).toISOString().split("T")[0];
}

export const GET: APIRoute = async ({ site }) => {
  const base = site?.href?.replace(/\/$/, "") ?? "https://www.buylandcr.com";
  const today = toDateStr(new Date());

  const staticPages = [
    { loc: `${base}/`,            changefreq: "weekly",  priority: "1.0", lastmod: today },
    { loc: `${base}/properties`,  changefreq: "weekly",  priority: "0.9", lastmod: today },
    { loc: `${base}/blog`,        changefreq: "weekly",  priority: "0.7", lastmod: today },
    { loc: `${base}/privacy-policy`, changefreq: "yearly", priority: "0.3", lastmod: today },
  ];

  const properties = getAllProperties();
  const propertyPages = properties.map((p) => ({
    loc: `${base}/properties/${p.slug}`,
    changefreq: "monthly",
    priority: "0.8",
    lastmod: today,
  }));

  const blogPosts = await getCollection("blog");
  const blogPages = blogPosts.map((post) => ({
    loc: escapeXml(`${base}/blog/${post.slug}`),
    changefreq: "monthly",
    priority: "0.6",
    lastmod: toDateStr(post.data.date),
  }));

  const allPages = [...staticPages, ...propertyPages, ...blogPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allPages
    .map(
      (p) =>
        `  <url>\n    <loc>${p.loc}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
    )
    .join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
