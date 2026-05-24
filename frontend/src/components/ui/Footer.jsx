import { HashLink } from "react-router-hash-link";

function FooterSection() {
  return (
    <footer className="mx-auto w-full border-t border-emerald-200 bg-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.16em] text-emerald-700">
            📊 SheetXray
          </p>
          <p className="mt-1 text-sm text-emerald-700 max-w-md">
            Upload files, organize sheets, and prepare data for chat workflows. Built with love by Atul Yadav.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <HashLink
            smooth
            to="/#"
            className="rounded-md px-3 py-2 font-mono text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-900"
          >
            Home
          </HashLink>
          <a
            href="https://github.com/AtulYadavCodes"
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-3 py-2 font-mono text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-900"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;