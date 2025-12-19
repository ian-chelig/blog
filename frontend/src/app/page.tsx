import Link from "next/link";

export interface Article {
  title: string;
  description: string;
  slug: string;
  author: string;
  category: string;
  body: string;
  publishedAt: string;
}

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";

function formatDateUTC(input: string) {
  const d = new Date(input);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${m}/${day}/${y}`;
}

async function getArticles(): Promise<Article[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/articles?populate=*&sort=publishedAt:desc`,
    {
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

export default async function Page() {
  const articles = await getArticles();

  return (
    <div>
      {articles.map((article) => (
        <article key={article.slug}>
          <div className="items-center justify-items-center rounded-lg bg-zinc-900/60 border border-zinc-800/70 px-4 py-2 shadow-sm g-gray-700/10 m-2">
            <Link href={`/${article.slug}`}>
              <div>
                <h3 className="capitalize text-3xl font-bold">
                  {article.title}
                </h3>
              </div>
              <div>
                <p className="text-lg text-gray-500">{article.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">
                  Published: {formatDateUTC(article.publishedAt)}
                </p>
              </div>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
