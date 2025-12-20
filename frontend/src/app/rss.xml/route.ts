import RSS from "rss";
import getArticles from "../lib/getArticles";

export async function GET() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const articles = await getArticles();
  const feed = new RSS({
    title: "Ian Chelig",
    description: "Blog posts",
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/rss.xml`,
    language: "en",
  });

  for (const a of articles) {
    const link = `${SITE_URL}/${a.slug}`;
    feed.item({
      title: a.title ?? "",
      description: a.description ?? "",
      url: link,
      guid: link,
      date: a.publishedAt ?? new Date().toISOString(),
    });
  }

  const xml = feed.xml({ indent: true });
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
