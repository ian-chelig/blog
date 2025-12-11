"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export interface Article {
  title: string;
  description: string;
  slug: string;
  author: string;
  category: string;
  body: string;
  publishedAt: Date;
}

export default function page() {
  const [articles, setArticles] = useState<Article[]>([]);
  const STRAPI_URL = "http://localhost:1337";

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    return new Date(date).toLocaleDateString("en-US", options);
  };

  const getArticles = async () => {
    const response = await fetch(`${STRAPI_URL}/api/articles?populate=*`);
    const data = await response.json();
    setArticles(data.data);
  };

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <div>
      {articles.map((article) => (
        <article
          key={article.title}
        >
          <div className="items-center justify-items-center m-2 bg-gray-700/10 rounded-lg">
            <Link href={`/${article.slug}`}>
              <div><h3 className="text-3xl font-bold mb-2">{article.title}</h3></div>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
};
