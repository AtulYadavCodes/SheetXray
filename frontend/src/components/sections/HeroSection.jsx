import image from "../../assets/image.png";

function HeroSection() {
  return (
    <>
      <section
        id="home"
        className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24"
      >
        {/* Left Column: Text Content */}
        <div className="flex flex-col justify-center space-y-6 text-left">
          <div>
            <span className="inline-flex items-center rounded border border-gray-800 bg-gray-900 px-3 py-1 font-mono text-xs font-medium uppercase tracking-[0.16em] text-white">
              RAG + Agentic Intelligence
            </span>
          </div>

          <h1 className="font-mono text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-tight">
            Organize sheets. <br />
            Upload files. <br />
            <span className="text-white">Prepare data for chat.</span>
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-gray-400 md:text-base">
            SheetXray uses advanced RAG (Retrieval Augmented Generation) to search across all your uploaded files and folders, then deploys intelligent agents to generate insights and answer your questions. Upload your Excel, CSV, and Google Sheet files, and let our agentic system analyze, extract, and chat with your data in real-time.
          </p>

          {/* Added Action Buttons for a Complete Hero Section */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="/auth"
              className="inline-flex items-center justify-center bg-white px-5 py-3 font-mono text-sm font-semibold text-black transition-colors hover:bg-gray-200"
            >
              Get Started
            </a>
            <a
              href="#demo"
              className="inline-flex items-center justify-center border border-gray-700 bg-transparent px-5 py-3 font-mono text-sm font-semibold text-white transition-colors hover:bg-gray-900"
            >
              Watch Demo
            </a>
          </div>
        </div>

        {/* Right Column: Image Container */}
        <div className="flex items-center justify-center lg:mt-0">
          <div className="relative w-full overflow-hidden rounded-xl by-100 p-2 shadow-2xl shadow-white/5">
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