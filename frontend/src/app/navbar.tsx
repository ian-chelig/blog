const Navbar = () => {
  return (
    <div className="w-full text-white py-4">
      <div className="max-w-6xl mx-auto px-4 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold tracking-wide">
            <a href="/">Ian Chelig</a>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div><a className="hover:text-gray-400" href="/">Blog</a></div>
            <div className="text-gray-500">|</div>
            <div><a className="hover:text-gray-400" href="/about">About</a></div>
            <div className="text-gray-500">|</div>
            <div>
              <a className="hover:text-gray-400" href="https://www.linkedin.com/in/ian-chelig-790949129/">
                LinkedIn
              </a>
            </div>
            <div className="text-gray-500">|</div>
            <div>
              <a className="hover:text-gray-400" href="https://github.com/ian-chelig">
                Github
              </a>
            </div>
            <div className="text-gray-500">|</div>
            <div><a className="hover:text-gray-400" href="/contact">Contact</a></div>
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <input
            className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm w-48 focus:outline-none focus:ring focus:ring-gray-600"
            placeholder="Search..."
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;


