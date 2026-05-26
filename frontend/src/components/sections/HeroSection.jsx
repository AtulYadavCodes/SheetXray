import image from "../../assets/image.png";

function HeroSection() {

  
  return (
    <>
     
      <section
        id="home"
        className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24 font-mono text-zinc-900 selection:bg-blue-800 selection:text-white"
      >
       
        <div className="flex flex-col justify-center space-y-6 text-left">
          
         
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl lg:leading-tight uppercase">
            Organize sheets. <br />
            Upload files. <br />
            <span className="bg-blue-800 text-white px-2 inline-block mt-1">
              Chat with data.
            </span>
          </h1>

         
          <p className="max-w-xl text-sm leading-relaxed text-zinc-700 md:text-base border-l-4 border-blue-800 pl-4 py-1">
            SheetXray uses advanced RAG (Retrieval Augmented Generation) to search across all your uploaded files and folders, then deploys intelligent agents to generate insights and answer your questions. Upload your Excel, CSV, and Google Sheet files, and let our agentic system analyze, extract, and chat with your data in real-time.
          </p>

          
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="/auth"
              className="relative inline-flex items-center justify-center bg-zinc-200 px-6 py-3 font-mono text-sm font-bold text-black border-2 border-t-white border-l-white border-b-zinc-700 border-r-zinc-700 active:border-t-zinc-700 active:border-l-zinc-700 active:border-b-white active:border-r-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            >
              Get Started
            </a>
           
          </div>
        </div>

        {/* Right Column: The Product Showcase Window */}
        <div className="flex items-center justify-center lg:mt-0">
          
         
          <div className="w-full bg-zinc-200 border-2 border-t-white border-l-white border-b-zinc-900 border-r-zinc-900 p-1 shadow-[4px_4px_10px_rgba(0,0,0,0.3)]">
            
           
            <div className="bg-gradient-to-r from-blue-900 to-blue-500 text-white px-2 py-1 flex items-center justify-between font-bold text-xs tracking-wide">
              <div className="flex items-center gap-2 select-none">
                <span className="text-sm">📊</span>
                <span>SheetXray_Viewer.exe</span>
              </div>
            
              <div className="flex gap-1">
                <button className="w-4 h-4 bg-zinc-200 border border-t-white border-l-white border-b-zinc-700 border-r-zinc-700 text-black text-[9px] font-bold flex items-center justify-center pb-1 pointer-events-none">_</button>
                <button className="w-4 h-4 bg-zinc-200 border border-t-white border-l-white border-b-zinc-700 border-r-zinc-700 text-black text-[9px] font-bold flex items-center justify-center pointer-events-none">🗖</button>
                <button className="w-4 h-4 bg-zinc-200 border border-t-white border-l-white border-b-zinc-700 border-r-zinc-700 text-black text-[9px] font-bold flex items-center justify-center pb-0.5 ml-1 pointer-events-none">X</button>
              </div>
            </div>

           
            <div className="flex gap-4 px-2 py-1 text-xs text-zinc-800 border-b border-zinc-400 cursor-default select-none">
              <span><span className="underline">F</span>ile</span>
              <span><span className="underline">E</span>dit</span>
              <span><span className="underline">V</span>iew</span>
              <span><span className="underline">H</span>elp</span>
            </div>

          
            <div className="relative mt-1 bg-zinc-400 border-2 border-t-zinc-700 border-l-zinc-700 border-b-white border-r-white p-1">
  <div className="relative w-full aspect-video">
    <iframe
      src="https://www.youtube.com/embed/OQDtZGXLuQ0"
      title="SheetXray product video"
      className="absolute top-0 left-0 w-full h-full filtering-pixelated border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  </div>
</div>
            
           
            <div className="mt-1 border border-t-zinc-700 border-l-zinc-700 border-b-white border-r-white bg-zinc-200 px-2 py-0.5 text-[11px] text-zinc-600 flex justify-between select-none">
              <span>Status: Ready</span>
              <span className="border-l border-zinc-400 pl-2">COM1</span>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;