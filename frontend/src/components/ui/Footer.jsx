import { HashLink } from "react-router-hash-link";

function FooterSection() {
  return (
    <footer className="mx-auto w-full border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8 dark:border-gray-800">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.16em] text-gray-400">
            SheetXray
          </p>
          <p className="mt-1 text-sm text-gray-400 max-w-md">
            Upload files, organize sheets, and prepare data for chat workflows. Built with love by Atul Yadav.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <HashLink
            smooth
            to="/#"
            className="rounded-md px-3 py-2 font-mono text-gray-400 transition hover:bg-gray-700 hover:text-white"
          >
            Home
          </HashLink>
          <a
            href="https://github.com/AtulYadavCodes"
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-3 py-2 font-mono text-white transition hover:bg-gray-700"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;