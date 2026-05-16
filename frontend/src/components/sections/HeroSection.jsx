import image from "../../assets/image.png";

function HeroSection() {
  return (
    <>
      <section
        id="home"
        className="mx-auto grid w-full max-w-7xl items-center gap-10  px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8"
      >
        <div className="space-y-5">
          <span className="inline-flex border border-gray-700 bg-gray-900 px-3 py-1 font-mono text-xs uppercase tracking-[0.16em] text-yellow-400">
            RAG + Agentic Intelligence
          </span>

          <h1 className="font-mono text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Organize sheets. <br />
            Upload files. <br />
            Prepare data for chat.
          </h1>

          <p className="max-w-xl text-base leading-7 text-gray-100 sm:text-sm">
            SheetXray uses advanced RAG (Retrieval Augmented Generation) to search across all your uploaded files and folders, then deploys intelligent agents to generate insights and answer your questions. Upload your Excel, CSV, and Google Sheet files, and let our agentic system analyze, extract, and chat with your data in real-time.
          </p>


        </div>

        <div>
          <div className="space-y-3">
            <img
              src={image}
              alt="SheetXray demo"
              className="w-full object-cover"
            />


          </div>
        </div>

      </section>
    </>
  );
}

export default HeroSection;
