export default function page() {
  return (
    <div className="items-center justify-items-center rounded-lg bg-zinc-900/60 border border-zinc-800/70 px-4 py-2 shadow-sm m-2">
      <div className="space-y-4 text-zinc-200 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold mb-1">About</h2>
        <p>
          I'm a long-time Linux user and enthusiast. Throughout the years I've
          spent time exploring the worlds of system administration, networking
          and system internals via experiments run on a self-hosted lab (that
          even hosts this site)! I'm looking to begin my career in IT. This site
          will serve as a documentation of the projects I embark on due to that.
        </p>

        <h2 className="text-lg font-semibold mb-1">Skills</h2>
        <ul className="list-disc list-inside space-y-1 text-zinc-300">
          <li>Bash, C and C++</li>
          <li>Python, Java, C#, Lua</li>
          <li>Git, Docker, SQL</li>
          <li>HTML, CSS, Javascript, PHP</li>
          <li>Nodejs, Nextjs, Tailwind</li>
        </ul>

        <h2 className="text-lg font-semibold mb-1">Contact me</h2>
        <p className="text-zinc-300">
          For a more traditional overview of my background, you can find me on{" "}
          <a
            href="https://www.linkedin.com/in/ian-chelig-790949129/"
            className="underline decoration-dotted hover:text-zinc-100"
          >
            LinkedIn
          </a>{" "}
          and{" "}
          <a
            href="https://github.com/ian-chelig"
            className="underline decoration-dotted hover:text-zinc-100"
          >
            GitHub
          </a>
          . For anything else, email works:{" "}
          <a
            href="mailto:ianm.chelig@gmail.com"
            className="underline decoration-dotted hover:text-zinc-100"
          >
            ianm.chelig@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
