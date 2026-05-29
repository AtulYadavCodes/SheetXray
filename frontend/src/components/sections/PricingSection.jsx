import { HashLink } from "react-router-hash-link";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/LoginContext";

function PricingSection() {
    const navigate = useNavigate();
    const { isAuth } = useAuth();
    
    const plans = [
        {
            name: "Free",
            price: "Rs 0",
            period: "",
            description: "Get started with basic features",
            features: [
                "Up to 3 folders",
                "up to 10 files in each folder",
                "daily upto 10 queries",
            ],
            highlight: false
        },
        {
            name: "Pro monthly",
            price: "Rs 99",
            period: " / mo",
            description: "For users who want to pay monthly",
            features: [
                "Unlimited folders",
                "Unlimited files in each folder",
                "unlimited queries",
            ],
            highlight: true
        },
        {
            name: "pro complete",
            price: "Rs 1000",
            period: " / once",
            description: "For users who want to pay once and use forever",
            features: [
                "Unlimited folders",
                "Unlimited files in each folder",
                "unlimited queries",
            ],
            highlight: false
        }
    ];

    return (
        <section id="pricing" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 font-sans text-black">
           
           
                <h2 className="text-3xl font-bold  text-black sm:text-4xl">
                    Simple Pricing
                </h2>
                <p className="mt-2  mb-5 text-sm text-gray-900">
                    Choose the plan that works for you
                </p>
          

            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan, idx) => (
                    <div
                        key={idx}
                        className="p-6 border-2 flex flex-col h-full border-white border-b-gray-700 border-r-gray-700  shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    >
                        
                        <div className={`px-2 py-1 mb-4 border select-none ${
                            plan.highlight 
                                ? "bg-[#000080] text-white border-gray-600" 
                                : "bg-[#808080] text-white border-gray-400"
                        }`}>
                            <h3 className="font-bold text-sm uppercase tracking-wider">
                                {plan.highlight ? "★ " : ""}{plan.name}
                            </h3>
                        </div>

                      
                        <div className="mb-4 p-3 bg-white border-2 border-gray-700 border-b-white border-r-white shadow-[inset_1px_1px_0px_rgba(0,0,0,1)]">
                            <span className="text-3xl font-bold tracking-tight text-black">{plan.price}</span>
                            {plan.period && (
                                <span className="text-xs font-bold text-gray-700">{plan.period}</span>
                            )}
                        </div>

                        <p className="text-xs text-gray-900 mb-6 font-bold min-h-[32px]">{plan.description}</p>

                        {/* Features List */}
                        <ul className="mb-8 space-y-2 flex-1">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-black font-medium">
                                    <span className="text-black font-bold">✔</span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                       
                        <div className="mt-auto pt-2">
                            <button
                                onClick={() => {
                                    if (isAuth) {
                                        navigate("/dashboard/subs");
                                    } else {
                                        navigate("/auth");
                                    }
                                }}
                                className="w-full bg-[#e4e4e7] border-2 border-white border-b-gray-900 border-r-gray-900 px-4 py-2 text-xs font-bold text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:border-gray-900 active:border-b-white active:border-r-white active:shadow-[inset_1px_1px_0px_rgba(0,0,0,1)] outline-none focus:outline-1 focus:outline-dotted focus:outline-black"
                            >
                                Setup subscription...
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default PricingSection;