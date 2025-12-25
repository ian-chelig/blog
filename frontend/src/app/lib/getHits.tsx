import MeiliSearch from "meilisearch";
import fs from "fs";

export default async function hits(query: string) {
  if (!query) return [];
  const key = fs.readFileSync("/secrets/meilisearch.key", "utf-8").trim();
  const client = new MeiliSearch({
    host: process.env.MEILI_HOST!,
    apiKey: key!, // server-only, NOT NEXT_PUBLIC
  });
  const res = await client.index("article").search(query, {
    limit: 20,
    attributesToCrop: ["body:20", "description:20"],
    cropMarker: "…",
    attributesToHighlight: ["body", "description", "title"],
    highlightPreTag: "<mark>",
    highlightPostTag: "</mark>",
    attributesToSearchOn: ["title", "body", "description"],
  });
  return res.hits as any[];
}
