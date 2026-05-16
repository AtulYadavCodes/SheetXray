import React, { useEffect, useState } from "react";
import axios from "axios";

function Subs() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState('pro');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_BASE}/api/v1/users/profile`,
                    { credentials: "include" }
                );
                const result = await res.json();
                setUser(result.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch user:", err);
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handlePayment = async () => {
        if (!selectedPlan) return;
        // TODO: Integrate with payment gateway (Razorpay)
        console.log("Processing payment for:", selectedPlan);
    };

    if (loading) {
        return (
            <div className="p-6 text-gray-400 font-mono text-sm">
                $ loading subscription...
            </div>
        );
    }

    return (
        <section className="w-full px-6 sm:px-10 lg:px-16 py-8 font-mono">
            <h2 className="text-3xl font-semibold text-white mb-8">
                Subscription Plans
            </h2>

            {user?.usertype === 'premiummonthly' || 'premiumlifetime' ? (
                // Already Pro
                <div className="max-w-4xl">
                    {/* Header Card */}
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-lg p-8 mb-8 text-gray-900">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-4xl font-bold mb-2">🎉 Premium Active</h3>
                                <p className="text-gray-800 text-lg">You're enjoying all premium benefits</p>
                            </div>
                            <div className="text-6xl">✨</div>
                        </div>
                    </div>

                    {/* Plan Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Plan Type Card */}
                        <div className="border-2 border-gray-700 rounded-lg p-6 bg-gray-900 hover:shadow-lg transition">
                            <h4 className="text-sm text-gray-400 mb-2 uppercase tracking-wide font-mono">Plan Type</h4>
                            <p className="text-3xl font-bold text-white mb-2">
                                {user?.usertype === 'premiumlifetime' ? 'Lifetime' : 'Monthly'}
                            </p>
                            <p className="text-gray-400 text-sm">
                                {user?.usertype === 'premiumlifetime'
                                    ? 'One-time payment for lifetime access'
                                    : 'Renews monthly'}
                            </p>
                        </div>

                        {/* Member Since Card */}
                        <div className="border-2 border-gray-700 rounded-lg p-6 bg-gray-900 hover:shadow-lg transition">
                            <h4 className="text-sm text-gray-400 mb-2 uppercase tracking-wide font-mono">Member Since</h4>
                            <p className="text-3xl font-bold text-white mb-2">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                            <p className="text-gray-400 text-sm">Keep enjoying premium features</p>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="border-2 border-gray-700 rounded-lg p-8 bg-gray-900 mb-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Premium Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <span className="text-green-500 text-xl mt-1">✓</span>
                                <div>
                                    <p className="font-semibold text-white">Unlimited File Uploads</p>
                                    <p className="text-sm text-gray-400">Upload & organize unlimited spreadsheets</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-green-500 text-xl mt-1">✓</span>
                                <div>
                                    <p className="font-semibold text-white">Advanced RAG Search</p>
                                    <p className="text-sm text-gray-400">Search across all your files instantly</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-green-500 text-xl mt-1">✓</span>
                                <div>
                                    <p className="font-semibold text-white">Priority Support</p>
                                    <p className="text-sm text-gray-400">Get help from our support team</p>
                                </div>
                            </div>
                            {/* <div className="flex items-start gap-3">
                                <span className="text-green-500 text-xl mt-1">✓</span>
                                <div>
                                    <p className="font-semibold text-white">Custom Agents</p>
                                    <p className="text-sm text-gray-400">Configure AI agents for your needs</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-green-500 text-xl mt-1">✓</span>
                                <div>
                                    <p className="font-semibold text-white">API Access</p>
                                    <p className="text-sm text-gray-400">Integrate SheetXray with your apps</p>
                                </div>
                            </div> */}
                            <div className="flex items-start gap-3">
                                <span className="text-green-500 text-xl mt-1">✓</span>
                                <div>
                                    <p className="font-semibold text-white">Advanced Analytics</p>
                                    <p className="text-sm text-gray-400">Deep insights into your data</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="border-2 border-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition">
                            📥 Download Invoice
                        </button>

                    </div>
                </div>
            ) : (
                // Payment Plans
                <div className="max-w-4xl space-y-6">
                    {/* Pro Plan Card */}
                    <div className="border-2 border-gray-700 rounded-lg p-6 hover:border-yellow-400 transition cursor-pointer bg-gray-900"
                        onClick={() => setSelectedPlan('pro')}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-2xl font-semibold text-white">Pro Plan</h3>
                                <p className="text-gray-400 text-sm mt-1">For power users</p>
                            </div>
                            <div className="text-right">
                                <span className="text-4xl font-bold text-white">₹99</span>
                                <span className="text-gray-400 text-sm">/month</span>
                            </div>
                        </div>

                        <ul className="space-y-2 mb-6 text-sm text-gray-300">
                            <li>✓ Unlimited file uploads</li>
                            <li>✓ Advanced RAG search</li>

                            <li>✓ Priority support</li>

                        </ul>

                        <div className="flex items-center gap-3">
                            <input
                                type="radio"
                                name="plan"
                                value="pro"
                                checked={selectedPlan === 'pro'}
                                onChange={(e) => setSelectedPlan(e.target.value)}
                                className="w-4 h-4"
                            />
                            <span className="text-gray-300">Select Pro Plan</span>
                        </div>
                    </div>

                    {/* life Plan Card */}
                    <div className="border-2 border-gray-700 rounded-lg p-6 hover:border-yellow-400 transition cursor-pointer bg-gray-900"
                        onClick={() => setSelectedPlan('enterprise')}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-2xl font-semibold text-white">Enterprise</h3>
                                <p className="text-gray-400 text-sm mt-1">For teams & organizations</p>
                            </div>
                            <div className="text-right">
                                <span className="text-4xl font-bold text-white">₹999</span>
                                <span className="text-gray-400 text-sm">/life</span>
                            </div>
                        </div>

                        <ul className="space-y-2 mb-6 text-sm text-gray-300">
                            <li>✓ Everything in Pro</li>


                            <li>✓ Dedicated support</li>

                        </ul>

                        <div className="flex items-center gap-3">
                            <input
                                type="radio"
                                name="plan"
                                value="enterprise"
                                checked={selectedPlan === 'enterprise'}
                                onChange={(e) => setSelectedPlan(e.target.value)}
                                className="w-4 h-4"
                            />
                            <span className="text-gray-300">Select lifetime Plan</span>
                        </div>
                    </div>

                    {/* Payment Button */}
                    <button
                        onClick={handlePayment}
                        disabled={!selectedPlan}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 text-black font-semibold py-3 rounded-lg transition mt-6"
                    >
                        Proceed to Payment
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                        Secure payment powered by Razorpay
                    </p>
                </div>
            )}
        </section>
    );
}

export default Subs;
