import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

function Subs() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentError, setPaymentError] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState('pro');
    const [downloadingInvoice, setDownloadingInvoice] = useState(false);

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

    useEffect(() => {
        try {
            console.log("VITE_RAZORPAY_KEY_ID =>", import.meta.env.VITE_RAZORPAY_KEY_ID);
            console.log("window.Razorpay =>", typeof window !== "undefined" && !!window.Razorpay);
        } catch (e) {
            console.warn("Could not read import.meta.env from this context", e);
        }
    }, []);

    const handlePayment = async (plan = selectedPlan) => {
        if (!plan) return;

        try {
            setLoading(true);

            if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
                setLoading(false);
                alert(
                    "Missing Razorpay key. Add VITE_RAZORPAY_KEY_ID to your frontend .env and restart the dev server."
                );
                return;
            }

            if (typeof window === "undefined" || !window.Razorpay) {
                setLoading(false);
                alert(
                    "Razorpay checkout library not loaded. Ensure the checkout script is included in index.html and reload the page."
                );
                return;
            }

            const subscriptionType = plan === 'pro' ? 'premiummonthly' : 'premiumlifetime';

            const orderResponse = await fetch(
                `${import.meta.env.VITE_API_BASE}/api/v1/payments/createorder`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ type: subscriptionType }),
                }
            );

            const orderText = await orderResponse.text();
            if (!orderResponse.ok) {
                throw new Error(`Failed to create order: ${orderResponse.status} ${orderText}`);
            }

            const orderData = JSON.parse(orderText);
            const order = orderData.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                order_id: order.id,
                amount: order.amount,
                currency: order.currency,
                name: "SheetXray",
                description: `${subscriptionType === 'premiummonthly' ? 'Pro Monthly' : 'Pro Lifetime'} Subscription`,
                handler: async (response) => {
                    try {
                        const verifyResponse = await fetch(
                            `${import.meta.env.VITE_API_BASE}/api/v1/payments/verifypayment`,
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                credentials: "include",
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                }),
                            }
                        );

                        if (verifyResponse.ok) {
                            const profileRes = await fetch(
                                `${import.meta.env.VITE_API_BASE}/api/v1/users/profile`,
                                { credentials: "include" }
                            );
                            const profileData = await profileRes.json();
                            setUser(profileData.data);
                            alert("Payment successful! Your subscription is now active.");
                        } else {
                            alert("Payment verification failed. Please contact support.");
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        alert("Error verifying payment. Please try again.");
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    email: user?.email || "",
                    contact: user?.phone || "",
                },
                theme: {
                    color: "#059669",
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);

            try {
                razorpay.on && razorpay.on('payment.failed', function (response) {
                    console.error('Razorpay payment failed:', response);
                    const errMsg =
                        response?.error?.description || response?.error?.reason || 'Payment failed. Please try another payment method.';
                    setPaymentError(errMsg);
                    setLoading(false);
                });
            } catch (e) {
                console.warn('Could not attach payment.failed listener', e);
            }

            razorpay.open();
        } catch (error) {
            console.error("Payment error:", error);
            alert("Failed to initiate payment. Please try again.");
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async () => {
        try {
            setDownloadingInvoice(true);
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE}/api/v1/payments/getinvoice`,
                { credentials: "include" }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch invoice data');
            }

            const result = await response.json();
            const payment = result.data;

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            let yPosition = 20;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(24);
            doc.text("SheetXray", pageWidth / 2, yPosition, { align: "center" });

            yPosition += 15;
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("Invoice", pageWidth / 2, yPosition, { align: "center" });

            yPosition += 20;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("Invoice Details", 20, yPosition);

            yPosition += 10;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);

            const invoiceData = [
                [`Invoice ID:`, payment._id || "N/A"],
                [`Payment ID:`, payment.paymentId || "N/A"],
                [`Date:`, new Date(payment.createdAt).toLocaleDateString() || "N/A"],
                [`Amount:`, `₹${payment.amount || 0}`],
                [`Status:`, payment.status?.toUpperCase() || "N/A"],
                [`Subscription Type:`, payment.subscriptionType === 'premiumlifetime' ? 'Pro Lifetime' : 'Pro Monthly'],
                [`Start Date:`, new Date(payment.subscriptionstartdate).toLocaleDateString() || "N/A"],
                [`End Date:`, payment.subscriptionenddate ? new Date(payment.subscriptionenddate).toLocaleDateString() : "Lifetime"],
            ];

            invoiceData.forEach(([label, value]) => {
                doc.text(label, 20, yPosition);
                doc.text(String(value), 100, yPosition);
                yPosition += 8;
            });

            yPosition += 15;
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            doc.text("Thank you for your subscription!", pageWidth / 2, pageHeight - 20, { align: "center" });

            doc.save(`invoice-${payment._id || Date.now()}.pdf`);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            alert('Failed to download invoice');
        } finally {
            setDownloadingInvoice(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-emerald-700 text-sm">
                $ loading subscription...
            </div>
        );
    }

    return (
        <section className="w-full px-6 sm:px-10 lg:px-16 py-8 min-h-screen">
            <div className="w-100 h-9"></div>

            {user?.usertype === 'premiummonthly' || user?.usertype === 'premiumlifetime' ? (
                <div className="max-w-4xl">
                    <div className="bg-gradient-to-r from-white to-gray-200 rounded-lg p-8 mb-8 text-gray-900">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-4xl mb-2 font-normal">🎉 Premium Active</h3>
                                <p className="text-gray-800 text-lg">You're enjoying all premium benefits</p>
                            </div>
                            <div className="text-6xl">✨</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="border-2 border-gray-200 rounded-lg p-6 bg-white hover:shadow transition">
                            <h4 className="text-sm text-emerald-700 mb-2 uppercase tracking-wide font-normal">Plan Type</h4>
                            <p className="text-3xl text-emerald-900 mb-2">
                                {user?.usertype === 'premiumlifetime' ? 'Lifetime' : 'Monthly'}
                            </p>
                            <p className="text-emerald-700 text-sm">
                                {user?.usertype === 'premiumlifetime'
                                    ? 'One-time payment for lifetime access'
                                    : 'Renews monthly'}
                            </p>
                        </div>

                        <div className="border-2 border-gray-200 rounded-lg p-6 bg-white hover:shadow transition">
                            <h4 className="text-sm text-emerald-700 mb-2 uppercase tracking-wide font-normal">Member Since</h4>
                            <p className="text-3xl text-emerald-900 mb-2">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                            <p className="text-emerald-700 text-sm">Keep enjoying premium features</p>
                        </div>
                    </div>

                    <div className="border-2 border-gray-200 rounded-lg p-8 bg-white mb-8">
                        <h3 className="text-2xl text-emerald-900 mb-6 font-normal">Premium Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <span className="text-emerald-600 text-xl mt-1">✓</span>
                                <div>
                                    <p className="text-emerald-900">Unlimited File Uploads</p>
                                    <p className="text-sm text-emerald-700">Upload & organize unlimited spreadsheets</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-emerald-600 text-xl mt-1">✓</span>
                                <div>
                                    <p className="text-emerald-900">Advanced RAG Search</p>
                                    <p className="text-sm text-emerald-700">Search across all your files instantly</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-emerald-600 text-xl mt-1">✓</span>
                                <div>
                                    <p className="text-emerald-900">Priority Support</p>
                                    <p className="text-sm text-emerald-700">Get help from our support team</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-emerald-600 text-xl mt-1">✓</span>
                                <div>
                                    <p className="text-emerald-900">Advanced Analytics</p>
                                    <p className="text-sm text-emerald-700">Deep insights into your data</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={handleDownloadInvoice}
                            disabled={downloadingInvoice}
                            className="border-2 border-emerald-600 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {downloadingInvoice ? '⏳ Downloading...' : '📥 Download Invoice'}
                        </button>

                        {user?.usertype === 'premiummonthly' && (
                            <button
                                onClick={() => handlePayment('enterprise')}
                                className="border-2 border-emerald-600 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition"
                            >
                                ⬆️ Upgrade to Lifetime
                            </button>
                        )}

                    </div>
                </div>
            ) : (
                <div className="max-w-4xl space-y-6">
                    <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-emerald-300 transition cursor-pointer bg-white"
                        onClick={() => setSelectedPlan('pro')}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-2xl text-emerald-900 font-normal">Pro monthly</h3>
                                <p className="text-emerald-700 text-sm mt-1">For power users</p>
                            </div>
                            <div className="text-right">
                                <span className="text-4xl text-emerald-900">₹99</span>
                                <span className="text-emerald-700 text-sm">/month</span>
                            </div>
                        </div>

                        <ul className="space-y-2 mb-6 text-sm text-emerald-700">
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
                                className="w-4 h-4 text-emerald-600"
                            />
                            <span className="text-emerald-700">Select Pro Plan</span>
                        </div>
                    </div>

                    <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-emerald-300 transition cursor-pointer bg-white"
                        onClick={() => setSelectedPlan('enterprise')}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-2xl text-emerald-900 font-normal">Pro lifetime</h3>
                                <p className="text-emerald-700 text-sm mt-1">For teams & organizations</p>
                            </div>
                            <div className="text-right">
                                <span className="text-4xl text-emerald-900">₹1000</span>
                                <span className="text-emerald-700 text-sm">/life</span>
                            </div>
                        </div>

                        <ul className="space-y-2 mb-6 text-sm text-emerald-700">
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
                                className="w-4 h-4 text-emerald-600"
                            />
                            <span className="text-emerald-700">Select lifetime Plan</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={!selectedPlan}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white py-3 rounded-lg transition mt-6"
                    >
                        Proceed to Payment
                    </button>

                    <p className="text-xs text-emerald-700 text-center">
                        Secure payment powered by Razorpay
                    </p>
                </div>
            )}
        </section>
    );
}

export default Subs;
