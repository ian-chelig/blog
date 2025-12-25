"use client";

import { Suspense, useState } from "react";
import { FaRss } from "react-icons/fa";
import SearchBar from "./searchBar";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full pt-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold tracking-wide hover:text-gray-400">
            <a href="/">Ian Chelig</a>
          </div>

          <nav className="hidden md:flex items-center gap-4 text-sm">
            <a className="hover:text-gray-400" href="/">
              Blog
            </a>
            <div className="text-gray-500">|</div>
            <a className="hover:text-gray-400" href="/about">
              About
            </a>
            <div className="text-gray-500">|</div>
            <a
              className="hover:text-gray-400"
              target="_blank"
              rel="noreferrer"
              href="https://www.linkedin.com/in/ian-chelig-790949129/"
            >
              LinkedIn
            </a>
            <div className="text-gray-500">|</div>
            <a
              className="hover:text-gray-400"
              target="_blank"
              rel="noreferrer"
              href="https://github.com/ian-chelig"
            >
              Github
            </a>
            <div className="text-gray-500">|</div>
            <a
              className="hover:text-gray-400 inline-flex items-center gap-1"
              href="/rss.xml"
            >
              <span>Rss</span>
              <FaRss className="text-[0.85em] opacity-90" />
            </a>
          </nav>

          <button
            type="button"
            className="md:hidden rounded-md border border-zinc-700/60 px-3 py-2 text-sm hover:bg-white/5 leading-none"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <a
            href="mailto:ianm.chelig@gmail.com"
            className="hidden md:inline-flex items-center h-10 text-sm hover:text-gray-400"
          >
            ianm.chelig@gmail.com
          </a>

          <div className="w-full md:w-auto md:min-w-[18rem]">
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {open && (
          <div
            id="mobile-menu"
            className="md:hidden mt-2 rounded-lg border border-zinc-800/70 bg-zinc-950/60 p-2"
          >
            <div className="flex flex-col text-sm">
              <a className="rounded px-2 py-2 hover:bg-white/5" href="/">
                Blog
              </a>
              <a className="rounded px-2 py-2 hover:bg-white/5" href="/about">
                About
              </a>
              <a
                className="rounded px-2 py-2 hover:bg-white/5"
                target="_blank"
                rel="noreferrer"
                href="https://www.linkedin.com/in/ian-chelig-790949129/"
              >
                LinkedIn
              </a>
              <a
                className="rounded px-2 py-2 hover:bg-white/5"
                target="_blank"
                rel="noreferrer"
                href="https://github.com/ian-chelig"
              >
                Github
              </a>
              <a
                className="rounded px-2 py-2 hover:bg-white/5 inline-flex items-center gap-2"
                href="/rss.xml"
              >
                <span>Rss</span>
                <FaRss className="text-[0.85em] opacity-90" />
              </a>

              <a
                href="mailto:ianm.chelig@gmail.com"
                className="mt-2 border-t border-zinc-800/70 pt-2 px-2 text-zinc-400 break-all hover:text-gray-200"
              >
                ianm.chelig@gmail.com
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
