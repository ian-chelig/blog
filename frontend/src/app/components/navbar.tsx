const Navbar = () => {
  return (
    <div className="w-full pt-6">
      <div className="max-w-6xl mx-auto px-4">

        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold tracking-wide hover:text-gray-400" >
            <a href="/">Ian Chelig</a>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <a className="hover:text-gray-400" href="/">Blog</a>
            <div className="text-gray-400-500">|</div>
            <a className="hover:text-gray-400" href="/about">About</a>
            <div className="text-gray-500">|</div>
            <a className="hover:text-gray-400" target="_blank" href="https://www.linkedin.com/in/ian-chelig-790949129/">
              LinkedIn
            </a>
            <div className="text-gray-500">|</div>
            <a className="hover:text-gray-400" target="_blank" href="https://github.com/ian-chelig">
              Github
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <a
            href="mailto:ianm.chelig@gmail.com"
            className="text-s hover:text-gray-400"
          >
            ianm.chelig@gmail.com
          </a>

          <input
            className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs focus:outline-none focus:ring focus:ring-gray-600 w-48"
            placeholder="Search..."
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;


