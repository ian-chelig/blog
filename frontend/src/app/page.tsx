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
    const response = await fetch(
      `${STRAPI_URL}/api/articles?populate=*&sort=publishedAt:desc`,
    );
    const data = await response.json();
    setArticles(data.data);
  };

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <div>
      {articles.map((article) => (
        <article key={article.title}>
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
                  Published: {formatDate(article.publishedAt)}
                </p>
              </div>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
