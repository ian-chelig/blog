"use client";

import MeiliSearch from "meilisearch";
import Link from "next/link";
import formatDate from "../lib/formatDate";
import sanitizeHtml from "sanitize-html";
import getHits from "../lib/getHits";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q ?? "";
  const hits = await getHits(query);
  function pickSnippet(hit: any): string {
    const body = hit?._formatted?.body ?? "";
    const desc = hit?._formatted?.description ?? "";
    const bodyHasMark = body.includes("<mark>");
    const descHasMark = desc.includes("<mark>");

    if (bodyHasMark) return body;
    if (descHasMark) return desc;
    return desc || "";
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
          <div className="items-center justify-items-center rounded-lg bg-zinc-900/60 border border-zinc-800/70 px-4 py-2 shadow-sm m-2">
            <Link href={`/${hit.slug}`}>
              <div>
                <h3 className="capitalize text-3xl font-bold">{hit.title}</h3>
              </div>
              <div>
                <p
                  className="text-lg text-gray-500 line-clamp-5"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(pickSnippet(hit)),
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
