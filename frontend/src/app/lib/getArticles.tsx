import Article from "./article";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";

export default async function getArticles(): Promise<Article[]> {
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
