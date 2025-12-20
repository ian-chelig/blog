"use client";
import useScrollPosition from "../hooks/useScrollPosition";

function resetScroll() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const scrollToTop = () => {
  const scrollPosition = useScrollPosition();
  return (
    <div className="">
      {scrollPosition.y > 200 && (
        <div className="hidden lg:block fixed inset-x-0 bottom-10 z-50 pointer-events-none">
          {/* This matches your site container */}
          <div className="mx-auto max-w-7xl px-4">
            {/* This matches your 3-col grid; button sits in the right sidebar column */}
            <div className="grid lg:grid-cols-[minmax(0,14rem)_minmax(0,48rem)_minmax(0,14rem)]">
              <div />
              <div />
              <div className="flex justify-start lg:pl-8 md:pl-0">
                <button
                  type="button"
                  onClick={resetScroll}
                  className="pointer-events-auto rounded-full border border-zinc-700 bg-zinc-900/50 px-4 py-2 shadow hover:bg-zinc-700 transition text-2xl"
                  aria-label="Scroll to top"
                >
                  ↑
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default scrollToTop;
