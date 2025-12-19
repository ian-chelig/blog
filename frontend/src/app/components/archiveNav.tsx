import Link from "next/link";
import { Article } from "../page";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";

type MonthNav = { total: number; articles: Article[] };
type YearNav = {
  total: number;
  hasMonths: boolean;
  articles: Article[];
  months: Record<number, MonthNav>;
};
type YearArchiveNav = Record<number, YearNav>;

function monthName(m: number) {
  return new Date(Date.UTC(2000, m, 1)).toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
}

function formatDateUTC(input: string | Date) {
  const d = new Date(input);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${m}/${day}/${y}`;
}

function getArticlesByYear(articles: Article[]): YearArchiveNav {
  const output: YearArchiveNav = {};
  for (const v of articles) {
    const d = new Date(v.publishedAt);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();

    if (!output[year])
      output[year] = { total: 0, hasMonths: false, articles: [], months: {} };
    output[year].total++;
    output[year].articles.push(v);

    if (!output[year].months[month])
      output[year].months[month] = { total: 0, articles: [] };
    output[year].months[month].total++;
    output[year].months[month].articles.push(v);

    if (output[year].total > 5) output[year].hasMonths = true;
  }
  return output;
}

async function fetchArticles(): Promise<Article[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/articles?populate=*&sort=publishedAt:desc`,
    {
      // good defaults; change if you want ISR
      cache: "no-store",
    },
  );

  const json = await res.json();

  const data = json.data ?? [];

  return data.map((item: any) => {
    const a = item.attributes ?? item;
    return {
      title: a.title,
      description: a.description,
      slug: a.slug,
      author: a.author,
      category: a.category,
      body: a.body,
      publishedAt: a.publishedAt,
    } satisfies Article;
  });
}

export default async function ArchiveNav() {
  const articles = await fetchArticles();
  const navMap = getArticlesByYear(articles);

  const yearsDesc = Object.keys(navMap)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <nav
      aria-label="Archive"
      className="rounded-xl bg-zinc-900/60 backdrop-blur border border-white/5 shadow-lg px-4 py-3 font-mono text-slate-100"
    >
      <div className="mb-3 flex items-center justify-center">
        <Link
          href="/"
          className="text-sm text-slate-200/90 hover:text-slate-100 transition"
        >
          ← Blog
        </Link>
      </div>

      <div className="space-y-2">
        {yearsDesc.map((yearNum) => {
          const year = navMap[yearNum];
          const monthsDesc = Object.keys(year.months)
            .map(Number)
            .sort((a, b) => b - a);

          return (
            <details
              key={yearNum}
              open={yearsDesc[0] === yearNum}
              className="rounded-lg bg-black/10 border border-white/5 px-3 py-2"
            >
              <summary className="cursor-pointer list-none select-none flex items-center justify-between text-sm tracking-wide">
                <span>{yearNum}</span>
                <span className="text-xs text-slate-300/80">{year.total}</span>
              </summary>

              <div className="mt-2 h-px w-full bg-white/5" />

              <div className="mt-2 space-y-1">
                {year.hasMonths ? (
                  monthsDesc.map((m) => {
                    const bucket = year.months[m];
                    if (!bucket.articles.length) return null;

                    return (
                      <details
                        key={`${yearNum}-${m}`}
                        className="rounded-md px-2 py-1 hover:bg-white/5 transition"
                      >
                        <summary className="cursor-pointer list-none flex items-center justify-between text-xs text-slate-200/90">
                          <span>{monthName(m)}</span>
                          <span className="text-[11px] text-slate-300/70">
                            {bucket.total}
                          </span>
                        </summary>

                        <div className="mt-1 space-y-1 pl-2">
                          {bucket.articles.map((a) => (
                            <Link
                              key={a.slug}
                              href={`/${a.slug}`}
                              className="block text-sm text-slate-100/90 hover:text-slate-100 hover:underline underline-offset-4 truncate"
                              title={`${a.title} — ${formatDateUTC(a.publishedAt)}`}
                            >
                              {a.title}
                            </Link>
                          ))}
                        </div>
                      </details>
                    );
                  })
                ) : (
                  <div className="space-y-1">
                    {year.articles.map((a) => (
                      <Link
                        key={a.slug}
                        href={`/${a.slug}`}
                        className="block rounded-md px-2 py-1 text-sm text-slate-100/90 hover:text-slate-100 hover:bg-white/5 transition truncate"
                        title={`${a.title} — ${formatDateUTC(a.publishedAt)}`}
                      >
                        {a.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </nav>
  );
}
