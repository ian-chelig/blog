
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export interface Article {
  title: string;
  description: string;
  slug: string;
  author: string;
  category: string;
  body: string;
  publishedAt: Date;
}

export default function Home() {
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
    <div className="font-[geist] bg-gradient-to-t from-[#000000] to-[#222222] h-screen ">
      <div className="grid items-center justify-items-center pt-3">
        <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
          <li><a className="hover:text-gray-500" href="#">Blog</a></li> |
          <li><a className="hover:text-gray-500" href="#">About</a></li> |
          <li><a className="hover:text-gray-500" href="https://www.linkedin.com/in/ian-chelig-790949129/">LinkedIn</a></li> |
          <li><a className="hover:text-gray-500" href="https://github.com/ian-chelig">Github</a></li> |
          <li><a className="hover:text-gray-500" href="#">Contact</a></li>
        </ul>
        <input placeholder="Search..." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article
            key={article.title}
            className="shadow-md rounded-lg overflow-hidden"
          >
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{article.title}</h3>
              <p className="text-gray-600 mb-4">{article.body}</p>
              <p className="text-sm text-gray-500">
                Published: {formatDate(article.publishedAt)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div >
  );
}
