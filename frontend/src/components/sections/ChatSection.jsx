function ChatSection() {
    return (
        <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-10">
                <h2 className="font-bold text-3xl text-black ">
                    Chat with Your Data
                </h2>
                <p className="mt-2 text-black">
                    Interact with your spreadsheets in real-time
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-10">
                    <h3 className="font-mono text-xl text-black mb-8">Key Features</h3>

                    <div className="flex gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <span className="shrink-0 w-10 h-10 bg-[#c0c0c0] border-2 border-gray-700 border-b-white border-r-white flex items-center justify-center text-xl shadow-[inset_1px_1px_0px_rgba(0,0,0,1)]">📊</span>
                        </div>
                        <div>
                            <h4 className="font-mono text-black">Data Analysis</h4>
                            <p className="text-sm text-black">Get instant insights from your spreadsheet data with AI-powered analysis</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <span className="shrink-0 w-10 h-10 bg-[#c0c0c0] border-2 border-gray-700 border-b-white border-r-white flex items-center justify-center text-xl shadow-[inset_1px_1px_0px_rgba(0,0,0,1)]">🔍</span>
                        </div>
                        <div>
                            <h4 className="font-mono text-black">Smart Search</h4>
                            <p className="text-sm text-black">Query your data naturally using conversational language</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <span className="shrink-0 w-10 h-10 bg-[#c0c0c0] border-2 border-gray-700 border-b-white border-r-white flex items-center justify-center text-xl shadow-[inset_1px_1px_0px_rgba(0,0,0,1)]">📈</span>
                        </div>
                        <div>
                            <h4 className="font-mono text-black">Trend Detection</h4>
                            <p className="text-sm text-black">Automatically identify patterns and trends in your data</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <span className="shrink-0 w-10 h-10 bg-[#c0c0c0] border-2 border-gray-700 border-b-white border-r-white flex items-center justify-center text-xl shadow-[inset_1px_1px_0px_rgba(0,0,0,1)]">⚡</span>
                        </div>
                        <div>
                            <h4 className="font-mono text-black">Real-time Processing</h4>
                            <p className="text-sm text-black">Get answers instantly without waiting for manual data processing</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <span className="shrink-0 w-10 h-10 bg-[#c0c0c0] border-2 border-gray-700 border-b-white border-r-white flex items-center justify-center text-xl shadow-[inset_1px_1px_0px_rgba(0,0,0,1)]">🔐</span>
                        </div>
                        <div>
                            <h4 className="font-mono text-black">Secure & Private</h4>
                            <p className="text-sm text-black">Your data stays private with end-to-end encryption</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <span className="shrink-0 w-10 h-10 bg-[#c0c0c0] border-2 border-gray-700 border-b-white border-r-white flex items-center justify-center text-xl shadow-[inset_1px_1px_0px_rgba(0,0,0,1)]">📁</span>
                        </div>
                        <div>
                            <h4 className="font-mono text-black">Multi-Format Support</h4>
                            <p className="text-sm text-black">Works with Excel, CSV, Google Sheets, and more</p>
                        </div>
                    </div>
                </div>

          <div className="w-full bg-zinc-200 border-2 border-t-white border-l-white border-b-zinc-900 border-r-zinc-900 p-1 shadow-[4px_4px_10px_rgba(0,0,0,0.3)]">
                    <div className="bg-gray-900 px-4 py-3 shrink-0">
                        <h3 className="font-mono text-sm text-white">SheetXray Chat</h3>
                        <p className="text-xs text-gray-300">Chat with your spreadsheet data</p>
                        
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-gray-50" style={{ minHeight: "500px" }}>
                        <div className="flex gap-3">
                            <div className="shrink-0 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                                <span className="text-xs font-mono text-white">S</span>
                            </div>
                            <div className="flex-1">
                                <p className="bg-gray-200 text-gray-900 px-3 py-2 rounded-lg text-sm font-mono">
                                    Hey! I can help you analyze your spreadsheet. Upload a CSV or Excel file to get started.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <div className="flex-1">
                                <p className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-mono text-right">
                                    Can you summarize the sales data?
                                </p>
                            </div>
                            <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-xs font-mono text-white">U</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="shrink-0 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                                <span className="text-xs font-mono text-white">S</span>
                            </div>
                            <div className="flex-1">
                                <p className="bg-gray-200 text-gray-900 px-3 py-2 rounded-lg text-sm font-mono">
                                    Based on your Q3 data, total sales increased 24% YoY. Top products: Widget A ($45K) and Widget B ($38K).
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <div className="flex-1">
                                <p className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-mono text-right">
                                    Show me growth trends
                                </p>
                            </div>
                            <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-xs font-mono text-white">U</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="shrink-0 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                                <span className="text-xs font-mono text-white">S</span>
                            </div>
                            <div className="flex-1">
                                <p className="bg-gray-200 text-gray-900 px-3 py-2 rounded-lg text-sm font-mono">
                                    Q1: $185K | Q2: $212K | Q3: $275K. That's 48.6% growth Q1 to Q3!
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="shrink-0 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                                <span className="text-xs font-mono text-white">S</span>
                            </div>
                            <div className="flex-1 bg-gray-200 px-3 py-2 rounded-lg">
                                <svg className="w-full h-24" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="30" y1="80" x2="280" y2="80" stroke="#d1d5db" strokeWidth="1" />
                                    <line x1="30" y1="60" x2="280" y2="60" stroke="#e5e7eb" strokeWidth="1" />
                                    <line x1="30" y1="40" x2="280" y2="40" stroke="#e5e7eb" strokeWidth="1" />
                                    <line x1="30" y1="20" x2="280" y2="20" stroke="#e5e7eb" strokeWidth="1" />

                                    <rect x="50" y="50" width="15" height="30" fill="#3b82f6" />
                                    <rect x="80" y="35" width="15" height="45" fill="#3b82f6" />
                                    <rect x="110" y="15" width="15" height="65" fill="#3b82f6" />
                                    <rect x="140" y="25" width="15" height="55" fill="#10b981" />
                                    <rect x="170" y="10" width="15" height="70" fill="#10b981" />
                                    <rect x="200" y="5" width="15" height="75" fill="#10b981" />

                                    <line x1="30" y1="20" x2="30" y2="80" stroke="#6b7280" strokeWidth="1.5" />
                                    <line x1="30" y1="80" x2="280" y2="80" stroke="#6b7280" strokeWidth="1.5" />
                                </svg>
                                <p className="text-xs text-gray-700 font-mono mt-1">Q1-Q3 Sales Growth</p>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </section>
    );
}

export default ChatSection;
