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
        <button
          className=" hidden lg:block
        fixed bottom-[40px] left-1/2 z-50
        -translate-x-1/2
        ml-[calc(24rem+0.50rem)]
        rounded-full border border-zinc-700 bg-zinc-900/50
        px-4 p-2 shadow hover:bg-zinc-700 transition text-2xl"
          onClick={resetScroll}
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default scrollToTop;
