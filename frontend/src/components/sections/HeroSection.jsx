import image from "../../assets/image.png";

function HeroSection() {
  return (
    <>
      <section
        id="home"
        className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24"
      >
        <div className="flex flex-col justify-center space-y-6 text-left">
         

          <h1 className="font-mono text-4xl font-bold tracking-tight text-emerald-900 sm:text-5xl lg:text-6xl lg:leading-tight">
            Organize sheets. <br />
            Upload files. <br />
            <span className="text-emerald-700">Chat with your data.</span>
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-emerald-800 md:text-base">
            SheetXray uses advanced RAG (Retrieval Augmented Generation) to search across all your uploaded files and folders, then deploys intelligent agents to generate insights and answer your questions. Upload your Excel, CSV, and Google Sheet files, and let our agentic system analyze, extract, and chat with your data in real-time.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="/auth"
              className="inline-flex items-center justify-center bg-emerald-600 px-5 py-3 font-mono text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Get Started →
            </a>
            <a
              href="https://www.youtube.com/@sheetxray"
              target="_blank"
              className="inline-flex items-center justify-center border border-emerald-300 bg-emerald-50 px-5 py-3 font-mono text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              Watch Demo
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center lg:mt-0">
          <div className="relative w-full overflow-hidden rounded-xl  p-2  ">
            <img
              src={image}
              alt="SheetXray product interface showing data analysis and chat assistant"
              className="h-auto w-full rounded-lg object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>
    </>
  );
}



export default HeroSection;