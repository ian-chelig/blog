import MeiliSearch from "meilisearch";

export default async function hits(query: string) {
  if (!query) return [];
  const client = new MeiliSearch({
    host: process.env.MEILI_HOST ?? "http://localhost:7700",
    apiKey: process.env.MEILI_MASTER_KEY ?? "aSampleMasterKey", // server-only, NOT NEXT_PUBLIC
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
