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
  const md = markdownit({
    // Enable HTML tags in source
    html: false,

    // Use '/' to close single tags (<br />).
    // This is only for full CommonMark compatibility.
    xhtmlOut: false,

    // Convert '\n' in paragraphs into <br>
    breaks: true,

    // CSS language prefix for fenced blocks. Can be
    // useful for external highlighters.
    langPrefix: 'language-',

    // Autoconvert URL-like text to links
    linkify: true,

    // Enable some language-neutral replacement + quotes beautification
    // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.mjs
    typographer: true,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '“”‘’',

    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externally.
    // If result starts with <pre... internal wrapper is skipped.
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
  if (article.body) {
    pure = DOMPurify.sanitize(md.render(article.body));
  }

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
