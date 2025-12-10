export default function Home() {
  return (
    <div className="font-[geist] bg-gradient-to-t from-[#000000] to-[#222222] h-screen ">
      <div className="grid items-center justify-items-center pt-3">
        <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
          <li><a className="hover:text-gray-500" href="#">Blog</a></li> |
          <li><a className="hover:text-gray-500" href="#">About</a></li> |
          <li><a className="hover:text-gray-500" href="https://www.linkedin.com/in/ian-chelig-790949129/">LinkedIn</a></li> |
          <li><a className="hover:text-gray-500" href="https://github.com/ian-chelig">Github</a></li> |
          <li><a className="hover:text-gray-500" href="#">Contact</a></li>
        </ul>
        <input placeholder="Search..." />
      </div>
    </div >
  );
}
