"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const qParam = searchParams.get("q") ?? "";
  const [q, setQ] = useState(qParam);

  useEffect(() => setQ(qParam), [qParam]);

  function clearQuery() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    const qs = params.toString();
  }

  function submitQuery(query: string) {
    const trimmed = query.trim();
    if (!trimmed) {
      clearQuery();
      return;
    }
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  const inputClass =
    "w-72 rounded-md border border-zinc-800 bg-zinc-950/40 px-3 py-2 pr-8 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600/40";

  const clearClass =
    "absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-zinc-400 opacity-70 hover:opacity-100 hover:bg-zinc-800/60";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitQuery(q);
      }}
      className="flex"
    >
      <div className="relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className={inputClass}
          placeholder="Search..."
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setQ("");
              clearQuery();
            }
          }}
        />
        {q ? (
          <button
            type="button"
            onClick={() => {
              setQ("");
              clearQuery();
            }}
            className={clearClass}
            aria-label="Clear search"
            title="Clear"
          >
            ×
          </button>
        ) : null}
      </div>
    </form>
  );
}
