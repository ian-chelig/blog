import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ScrollToTop from "./components/scrollToTop";
import Navbar from "./components/navbar";
import TableOfContents from "./components/tableOfContents";
import ArchiveNav from "./components/archiveNav";

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
            <div className="mx-auto max-w-7xl w-full px-4 pt-4 pb-8">
              <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,14rem)_minmax(0,50rem)_minmax(0,14rem)]">
                <aside className="hidden lg:block lg:order-1 lg:sticky lg:top-5 h-fit min-w-0">
                  <ArchiveNav />
                </aside>

                <section className="order-1 lg:order-2 min-w-0 w-full">
                  {children}
                </section>

                <aside className="hidden lg:block order-3 lg:sticky lg:top-5 h-fit min-w-0">
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
