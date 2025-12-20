import Link from "next/link";
import Article from "../lib/article";
import formatDateUTC from "../lib/formatDate";
import getArticles from "../lib/getArticles";

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

    if (output[year].total > 9) output[year].hasMonths = true;
  }
  return output;
}

export default async function ArchiveNav() {
  const articles = await getArticles();
  const navMap = getArticlesByYear(articles);

  const yearsDesc = Object.keys(navMap)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <nav
      aria-label="Archive"
      className="rounded-xl bg-zinc-900/60 backdrop-blur border border-white/5 shadow-lg px-4 py-3 font-mono"
    >
      <div className="mb-3 flex items-center justify-center">
        <Link href="/" className="text-sm hover:text-gray-400 transition">
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
                <span className="text-xs ">{year.total}</span>
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
                          <span className="text-[11px]">{bucket.total}</span>
                        </summary>

                        <div className="mt-1 space-y-1 pl-2">
                          <ul>
                            {bucket.articles.map((a) => (
                              <Link
                                key={a.slug}
                                href={`/${a.slug}`}
                                className="block text-sm text-slate-100/90 hover:text-slate-100 hover:underline underline-offset-4 truncate"
                                title={`${a.title} — ${formatDateUTC(a.publishedAt)}`}
                              >
                                <li>{a.title}</li>
                              </Link>
                            ))}
                          </ul>
                        </div>
                      </details>
                    );
                  })
                ) : (
                  <div className="space-y-1">
                    <ul>
                      {year.articles.map((a) => (
                        <Link
                          key={a.slug}
                          href={`/${a.slug}`}
                          className="block rounded-md px-2 py-1 text-sm hover:text-slate-100 hover:bg-white/5 transition truncate"
                          title={`${a.title} — ${formatDateUTC(a.publishedAt)}`}
                        >
                          <li>{a.title}</li>
                        </Link>
                      ))}
                    </ul>
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
