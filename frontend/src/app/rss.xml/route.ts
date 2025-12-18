import RSS from "rss";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
  const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

  // 1) create the feed
  const feed = new RSS({
    title: "Ian Chelig",
    description: "Blog posts",
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/rss.xml`,
    language: "en",
  });

  // 2) fetch articles from Strapi (adjust endpoint + fields to match your Strapi)
  const url =
    `${STRAPI_URL}/api/articles` +
    `?fields[0]=title&fields[1]=slug&fields[2]=description&fields[3]=publishedAt&fields[4]=updatedAt` +
    `&sort[0]=publishedAt:desc&pagination[pageSize]=50`;

  const res = await fetch(url, {
    headers: {
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    },
    cache: "no-store", // ensures fetch itself isn't cached
  });

  if (!res.ok) {
    return new Response("Failed to fetch articles for RSS", { status: 502 });
  }

  const json = await res.json();

  // Strapi v4 typical: { data: [{ attributes: {...} }] }
  const articles = (json?.data ?? []).map((d: any) => d.attributes ?? d);

  // 3) add each article as an item
  for (const a of articles) {
    const link = `${SITE_URL}/${a.slug}`;
    feed.item({
      title: a.title ?? "",
      description: a.description ?? "",
      url: link,
      guid: link,
      date: a.publishedAt ?? a.updatedAt ?? new Date().toISOString(),
    });
  }

  // 4) return the response as XML
  const xml = feed.xml({ indent: true });
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      // optional: disable CDN caching too
      "Cache-Control": "no-store",
    },
  });
}

