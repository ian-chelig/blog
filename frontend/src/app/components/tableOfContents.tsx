"use client";

import { useMounted } from "../hooks/useMounted";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type TocItem = { id: string; text: string };

const TableOfContents = () => {
  const mounted = useMounted();
  const pathname = usePathname();
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    if (!mounted) return;

    const content = document.getElementById("content");
    if (!content) {
      setItems([]);
      return;
    }

    const headers = Array.from(content.getElementsByTagName("h1"));

    const next = headers
      .map((h) => {
        const text = (h.textContent ?? "").trim();
        if (!text) return null;

        const id = text.replaceAll(" ", "-");
        h.id = id;

        return { id, text };
      })
      .filter((v) => v !== null);

    setItems(next);
  }, [mounted, pathname]);

  if (!mounted) return null;
  if (items.length === 0) return null;

  return (
    <div className="rounded-lg bg-zinc-900/50 border border-zinc-800/70 p-2">
      <ol className="list-decimal list-inside">
        {items.map((item) => (
          <li key={item.id}>
            <a className="capitalize hover:text-gray-400" href={`#${item.id}`}>
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TableOfContents;
