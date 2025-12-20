import Link from "next/link";
import getArticles from "./lib/getArticles";
import formatDateUTC from "./lib/formatDate";

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
