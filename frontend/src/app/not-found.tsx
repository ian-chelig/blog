import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="mx-auto max-w-lg rounded-xl border border-zinc-800/70 bg-zinc-900/50 px-8 py-10 text-center backdrop-blur-sm">
        <div className="max-w-md text-center">
          <p className="text-sm tracking-widest text-zinc-500 mb-2">404</p>

          <h1 className="text-3xl font-semibold text-zinc-100 mb-4">
            Article not found
          </h1>

          <p className="text-zinc-400 mb-8">
            The page you’re looking for doesn’t exist or may have been moved.
          </p>

          <Link
            href="/"
            className="
            inline-flex items-center justify-center
            rounded-md border border-zinc-700
            px-4 py-2 text-sm font-medium
            text-zinc-200
            hover:bg-zinc-800 hover:text-white
            transition
          "
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
