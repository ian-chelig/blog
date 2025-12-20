import qs from "qs";
import markdownit from "markdown-it";
import implicitFigures from "markdown-it-implicit-figures";
import DOMPurify from "isomorphic-dompurify";
import hljs from "highlight.js";
import { notFound } from "next/navigation";
import formatDate from "../lib/formatDate";

// Define isSpace function globally for markdown-it
declare global {
  function isSpace(code: number): boolean;
}

// Define the isSpace function
globalThis.isSpace = function (code: number): boolean {
  return (
    code === 0x20 ||
    code === 0x09 ||
    code === 0x0a ||
    code === 0x0b ||
    code === 0x0c ||
    code === 0x0d
  );
};

async function getArticle(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337";
  const path = "/api/articles";
  const url = new URL(path, baseUrl);

  url.search = qs.stringify({
    populate: "*",
    filters: {
      slug: {
        $eq: slug,
      },
    },
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch article");
  const data = await res.json();
  const article = data?.data[0] ?? null;
  return article;
}

export default async function Article({
  params,
}: {
  params: { slug: string };
}) {
  let pure = "";
  const slug = await params;
  if (!slug) notFound();
  const article = await getArticle(slug.slug);
  if (!article) notFound();

  const md = markdownit({
    html: false,
    xhtmlOut: false,
    breaks: true,
    langPrefix: "language-",
    linkify: true,
    typographer: true,
    quotes: "“”‘’",
    highlight: function (str: any, lang: any) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }

      return "";
    },
  });

  md.use(implicitFigures, {
    figcaption: true,
  });

  if (!article.body) {
    notFound();
  }
  pure = DOMPurify.sanitize(md.render(article.body));

  return (
    <div className="px-2 space-y-3 min-w-full">
      <article key={article.title} id="content" className="w-full">
        <div className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800/70 px-4 py-2 shadow-sm g-gray-700/10">
          <div>
            <h3 className="text-3xl font-bold capitalize">{article.title}</h3>
          </div>
          <div>
            <p className="text-lg text-gray-500">{article.description}</p>
          </div>
          <div>
            <p className="text-sm mb-4">
              Published: {formatDate(article.publishedAt)}
            </p>
          </div>
          <div
            className="max-w-5xl prose prose-theme  prose-img:mb-[-10] 
            prose-img:rounded-xl prose-img:mx-auto prose-figcaption:text-sm 
            prose-figcaption:text-center prose-figcaption:mb-4 prose-figcaption:text-zinc-500"
            dangerouslySetInnerHTML={{ __html: pure }}
          />
        </div>
      </article>
    </div>
  );
}
