import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ScrollToTop from "./components/scrollToTop";
import Navbar from "./components/navbar";
import TableOfContents from "./components/tableOfContents";
import Search from "./components/searchPage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ian Chelig",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 pt-2 pb-8">
              <div className="grid grid-cols-1 gap-0 lg:grid-cols-[14rem_minmax(0,48rem)_14rem]">
                <aside className="hidden lg:block order-2 lg:order-1 lg:sticky lg:top-5 h-fit pt-[8px]">
                  <div className="rounded-lg bg-zinc-900/50 border border-zinc-800/70 p-2 text-right">
                    <a className="hover:text-gray-400" href="/">
                      ↩Blog
                    </a>
                    <br />
                    2025 v
                  </div>
                </aside>

                <section className="order-1 lg:order-2 min-w-0">
                  {children}
                </section>

                <aside className="hidden lg:block order-3 lg:sticky lg:top-5 h-fit pt-[8px]">
                  <TableOfContents />
                </aside>
              </div>
            </div>
          </main>
          <div>
            <ScrollToTop />
          </div>
        </div>
      </body>
    </html>
  );
}
