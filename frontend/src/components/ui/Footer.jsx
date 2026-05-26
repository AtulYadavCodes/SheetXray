import { HashLink } from "react-router-hash-link";

function FooterSection() {
  return (
    <footer className="mx-auto w-full border-t bg-white p-1 font-sans text-black select-none">
      {/* Outer taskbar/status-strip container (Classic Win95 Raised Panel) */}
      <div className="bg-white p-3  flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Left Side Info Panel */}
        <div>
          <p className="font-bold text-xs uppercase tracking-wider text-black flex items-center gap-1.5">
            <span>📊</span> SheetXray
          </p>
          <p className="mt-1 text-xs text-black max-w-md font-medium leading-relaxed">
            Upload files, organize sheets, and prepare data for chat workflows. Built with love by Atul Yadav.
          </p>
        </div>

        {/* Right Side Controls Panel (Win95 Command Buttons) */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <HashLink
            smooth
            to="/#"
            className="bg-[#c0c0c0] text-black px-4 py-1 border-2 border-t-white border-l-white border-b-black border-r-black shadow-[inset_1px_1px_0px_#dfdfdf] active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:pt-1.5 active:pb-0.5 active:pl-4.5 active:pr-3.5 outline-none focus:outline-1 focus:outline-dotted focus:outline-black"
          >
            Home
          </HashLink>
          
          <a
            href="https://github.com/AtulYadavCodes"
            target="_blank"
            rel="noreferrer"
            className="bg-[#c0c0c0] text-black px-4 py-1 border-2 border-t-white border-l-white border-b-black border-r-black shadow-[inset_1px_1px_0px_#dfdfdf] active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:pt-1.5 active:pb-0.5 active:pl-4.5 active:pr-3.5 outline-none focus:outline-1 focus:outline-dotted focus:outline-black"
          >
            GitHub
          </a>
        </div>

      </div>
    </footer>
  );
}

export default FooterSection;