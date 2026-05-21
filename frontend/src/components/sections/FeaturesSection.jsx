import ChatSection from "./ChatSection";

function FeaturesSection() {
    const features = [
        {
            icon: "📁",
            title: "Organize Files",
            description: "Create folders and organize your spreadsheets efficiently"
        },
        {
            icon: "📤",
            title: "Upload Sheets",
            description: "Support for Excel, CSV, and Google Sheets formats"
        },
        {
            icon: "💬",
            title: "Chat with Data",
            description: "Query and analyze your data using natural language"
        },
        {
            icon: "🔐",
            title: "Secure Access",
            description: "API keys for secure programmatic access to your data"
        }
    ];

    return (
        <section id="features" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
                <h2 className="font-mono text-3xl font-semibold text-gray-900 sm:text-4xl">
                    Powerful Features
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                    Everything you need to manage and analyze your spreadsheets
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="rounded-lg border border-gray-200 bg-white p-6 text-center hover:shadow-lg transition"
                            >
                                <div className="text-4xl mb-3">{feature.icon}</div>
                                <h3 className="font-mono text-lg font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <ChatSection />
            </div>
        </section>
    );
}

export default FeaturesSection;
