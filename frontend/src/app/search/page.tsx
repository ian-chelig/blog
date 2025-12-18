import { MeiliSearch } from "meilisearch";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";

type SearchPageProps = {
  searchParams: { q?: string };
};

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  return new Date(date).toLocaleDateString("en-US", options);
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = (searchParams.q ?? "").trim();

  const hits: any[] = await (async () => {
    if (!q) return [];
    const client = new MeiliSearch({
      host: process.env.MEILI_HOST ?? "http://localhost:7700",
      apiKey: process.env.MEILI_MASTER_KEY ?? "aSampleMasterKey", // server-only, NOT NEXT_PUBLIC
    });
    const res = await client.index("article").search(q, {
      limit: 20,
      attributesToCrop: ["body:60", "description:40"],
      cropMarker: "…",
      attributesToHighlight: ["body", "description", "title"],
      highlightPreTag: "<mark>",
      highlightPostTag: "</mark>",
      attributesToSearchOn: ["title", "body", "description"],
    });
    return res.hits as any[];
  })();

  function pickSnippet(hit: any): string {
    const body = hit?._formatted?.body ?? "";
    const desc = hit?._formatted?.description ?? "";

    const bodyHasMark = body.includes("<mark>");
    const descHasMark = desc.includes("<mark>");

    if (descHasMark) return desc;
    if (bodyHasMark) return body;

    // no highlight anywhere; fall back to whatever text we have
    return body || desc || "";
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-semibold text-zinc-100">Search</h1>
          {q ? (
            <span className="rounded-md border border-zinc-800/70 bg-zinc-950/40 px-2 py-0.5 text-xs text-zinc-300">
              “{q}”
            </span>
          ) : null}
        </div>

        <div className="text-sm text-zinc-400">
          {q ? `${hits.length} result${hits.length === 1 ? "" : "s"}` : null}
        </div>
      </div>

      {q && hits.length === 0 ? (
        <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/30 p-6">
          <div className="text-zinc-200 font-semibold">No results.</div>
          <div className="mt-1 text-sm text-zinc-400">
            Try fewer words, or a different term.
          </div>
        </div>
      ) : null}
      {hits.map((hit) => (
        <article key={hit.id ?? hit.slug}>
          <div className="items-center justify-items-center rounded-lg bg-zinc-900/60 border border-zinc-800/70 px-4 py-2 shadow-sm g-gray-700/10 rounded-lg m-2">
            <Link href={`/${hit.slug}`}>
              <div>
                <h3 className="capitalize text-3xl font-bold">{hit.title}</h3>
              </div>
              <div>
                <p
                  className="text-lg text-gray-500 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(pickSnippet(hit)),
                  }}
                />
              </div>
              <div>
                <p className="text-sm text-gray-300">
                  Published: {formatDate(hit.publishedAt)}
                </p>
              </div>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
