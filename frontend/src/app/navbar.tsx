const Navbar = () => {
  return (
    <div>
      <div className="grid grid-cols-36 gap-4 items-center justify-items-center">
        <div className="col-start-9 col-span-2"><a className="hover:text-gray-500" href="/">Blog</a></div>
        <div className="col-span-2"> | </div>
        <div className="col-span-2"><a className="hover:text-gray-500" href="/about">About</a></div>
        <div className="col-span-2"> | </div>
        <div className="col-span-2"><a className="hover:text-gray-500" href="https://www.linkedin.com/in/ian-chelig-790949129/">LinkedIn</a></div>
        <div className="col-span-2"> | </div>
        <div className="col-span-2"><a className="hover:text-gray-500" href="https://github.com/ian-chelig">Github</a></div>
        <div className="col-span-2"> | </div>
        <div className="col-span-2"><a className="hover:text-gray-500" href="/contact">Contact</a></div>
      </div>

      <div className="grid grid-cols-36">
        <div className="col-span-2 col-start-24"><input placeholder="Search..." /></div>
      </div>
    </div>
  );
};

export default Navbar;


