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
import markdownit from 'markdown-it';
import implicitFigures from "markdown-it-implicit-figures";
import DOMPurify from 'isomorphic-dompurify';
import hljs from "highlight.js";
import { notFound } from "next/navigation";

declare global {
  function isSpace(code: number): boolean;
}

// Define the isSpace function
globalThis.isSpace = function(code: number): boolean {
  return code === 0x20 || code === 0x09 || code === 0x0A || code === 0x0B || code === 0x0C || code === 0x0D;
};

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
  const article = data?.data[0] ?? null;
  return article;
}
export default async function Article({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  if (!slug) notFound();
  const article = await getArticle(slug);
  if (!article) notFound();

  const md = markdownit({
    html: false,
    xhtmlOut: false,
    breaks: true,
    langPrefix: 'language-',
    linkify: true,
    typographer: true,
    quotes: '“”‘’',
    highlight: function(str: any, lang: any) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) { }
      }

      return ''; // use external default escaping
    }
  });

  md.use(implicitFigures, {
    figcaption: true,   // enable <figcaption> :contentReference[oaicite:1]{index=1}
    // dataType: true,  // optional: adds data-type="image" on <figure> :contentReference[oaicite:2]{index=2}
  });

  let pure = "";
  if (!article.body) {
    return;
  }
  pure = DOMPurify.sanitize(md.render(article.body));

  return (
    <div>
      <article
        key={article.title}
        id="content"
      >
        <div className="items-center justify-items-center rounded-lg bg-zinc-900/60 border border-zinc-800/70 px-4 py-2 shadow-sm g-gray-700/10 m-2">
          <div><h3 className="text-3xl font-bold capitalize">{article.title}</h3></div>
          <div><p className="text-lg text-gray-500">{article.description}</p></div>
          <div>
            <p className="text-sm mb-4">
              Published: {formatDate(article.publishedAt)}
            </p>
          </div>
          <div className="max-w-5xl prose prose-theme  prose-img:mb-[-10] 
            prose-img:rounded-xl prose-img:mx-auto prose-figcaption:text-sm 
            prose-figcaption:text-center prose-figcaption:mb-4 prose-figcaption:text-zinc-500"
            dangerouslySetInnerHTML={{ __html: pure }} />
        </div>
      </article>
    </div>
  );
};
