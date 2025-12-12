export interface Article {
  title: string;
  description: string;
  slug: string;
  author: string;
  category: string;
  body: string;
  publishedAt: Date;
}
import qs from "qs";

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  return new Date(date).toLocaleDateString("en-US", options);
};


async function getArticle(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337";
  const path = "/api/articles";
  const url = new URL(path, baseUrl);


  url.search = qs.stringify({
    populate: '*',
    filters: {
      slug: {
        $eq: slug,
      },
    },
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch article");
  const data = await res.json();
  const article = data?.data[0];
  return article;
}
export default async function Article({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  if (!slug) <p>Article not found!</p>;
  const article = await getArticle(slug);

  return (
    <div>
      <article
        key={article.title}
      >
        <div className="items-center justify-items-center rounded-lg bg-zinc-900/60 border border-zinc-800/70 px-4 py-2 shadow-sm g-gray-700/10 rounded-lg m-2">
          <div><h3 className="text-3xl font-bold">{article.title}</h3></div>
          <div><p className="text-lg text-gray-500">{article.description}</p></div>
          <div>
            <p className="text-sm mb-4">
              Published: {formatDate(article.publishedAt)}
            </p>
          </div>
          <div><p className="text-lg text-gray-400 mb-2">{article.body}</p></div>
        </div>
      </article>

    </div>
  );
};
