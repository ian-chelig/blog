import { FaRss } from "react-icons/fa";
import SearchBar from "./searchBar";
const Navbar = () => {
  return (
    <div className="w-full pt-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold tracking-wide hover:text-gray-400">
            <a href="/">Ian Chelig</a>
          </div>

          <div className="flex items-center gap-4 text-sm">
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
              href="https://www.linkedin.com/in/ian-chelig-790949129/"
            >
              LinkedIn
            </a>
            <div className="text-gray-500">|</div>
            <a
              className="hover:text-gray-400"
              target="_blank"
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
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <a
            href="mailto:ianm.chelig@gmail.com"
            className="inline-flex items-center -mt-10 h-10 text-sm hover:text-gray-400"
          >
            ianm.chelig@gmail.com
          </a>

          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
