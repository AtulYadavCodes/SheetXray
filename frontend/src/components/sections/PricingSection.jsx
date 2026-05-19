import { HashLink } from "react-router-hash-link";

function PricingSection() {
    const plans = [
        {
            name: "Free",
            price: "0",
            description: "Get started with basic features",
            features: [
                "Up to 1 folders",
                "1 GB storage",

            ],

            highlight: false
        },
        {
            name: "Pro monthly",
            price: "99",
            period: "/month",
            description: "For growing teams",
            features: [
                "Unlimited folders",
                "100 GB storage",
                "Priority support",
            ],

            highlight: true
        },
        {
            name: "pro complete",
            price: "1000",
            period: "/lifetime",

            features: [
                "Unlimited everything",
                "Dedicated support",
            ],

            highlight: false
        }
    ];

    return (
        <section id="pricing" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 ">
            <div className="mb-12 text-center">
                <h2 className="font-mono text-3xl font-semibold text-white sm:text-4xl">
                    Simple Pricing
                </h2>
                <p className="mt-4 text-lg text-gray-400">
                    Choose the plan that works for you
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan, idx) => (
                    <div
                        key={idx}
                        className={`rounded-lg border-2 p-8 ${plan.highlight
                            ? "border-white bg-white/20 shadow-lg"
                            : "border-gray-700  hover:shadow-md"
                            } transition`}
                    >
                        {plan.highlight && (
                            <div className="mb-3 inline-block rounded-full bg-white px-3 py-1 text-xs font-mono font-semibold text-gray-950">
                                Most Popular
                            </div>
                        )}
                        <h3 className="font-mono text-2xl font-semibold text-white mb-2">
                            {plan.name}
                        </h3>
                        <div className="mb-4">
                            <span className="text-4xl font-bold text-white">{plan.price}</span>
                            {plan.period && (
                                <span className="text-sm text-gray-400">{plan.period}</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-400 mb-6">{plan.description}</p>

                        <ul className="mb-8 space-y-3">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <span className="mt-1">✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>


                    </div>
                ))}
            </div>
        </section>
    );
}

export default PricingSection;
