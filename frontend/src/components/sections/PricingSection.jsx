import { HashLink } from "react-router-hash-link";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/LoginContext";

function PricingSection() {
    const navigate = useNavigate();
    const { isAuth } = useAuth();
    const plans = [
        {
            name: "Free",

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


            description: "For growing teams",
            features: [
                "Unlimited folders",
                "Unlimited files in each folder",
                "unlimited queries",
            ],

            highlight: true
        },
        {
            name: "pro complete",

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
        <section id="pricing" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 ">
            <div className="mb-12 text-center">
                <h2 className="font-mono text-3xl font-semibold text-emerald-900 sm:text-4xl">
                    Simple Pricing
                </h2>
                <p className="mt-4 text-lg text-emerald-700">
                    Choose the plan that works for you
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan, idx) => (
                    <div
                        key={idx}
                        className={`rounded-lg border-2 p-8 ${plan.highlight
                            ? "border-emerald-600 bg-emerald-50 shadow-lg"
                            : "border-emerald-200 bg-white hover:shadow-md"
                            } transition`}
                    >

                        <h3 className="font-mono text-2xl font-semibold text-emerald-900 mb-2">
                            {plan.name}
                        </h3>
                        <div className="mb-4">
                            <span className="text-4xl font-bold text-emerald-700">{plan.price}</span>
                            {plan.period && (
                                <span className="text-sm text-emerald-600">{plan.period}</span>
                            )}
                        </div>
                        <p className="text-sm text-emerald-700 mb-6">{plan.description}</p>

                        <ul className="mb-8 space-y-3">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                                    <span className="mt-1">✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <div>
                            <button
                                onClick={() => {
                                    if (isAuth) {
                                        navigate("/dashboard/subs");
                                    } else {
                                        navigate("/auth");
                                    }
                                }}
                                className="w-full rounded-md border border-emerald-600 bg-emerald-600 px-4 py-2 font-mono text-sm text-white transition hover:bg-emerald-700"
                            >
                                Get this Subscription
                            </button>
                        </div>


                    </div>
                ))}
            </div>
        </section>
    );
}

export default PricingSection;
