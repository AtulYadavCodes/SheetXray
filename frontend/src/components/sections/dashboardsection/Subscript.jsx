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
                    color: "#000080",
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

    // Clean inline styles for classical bevel depth
    const winBorderOut = { boxShadow: "inset 1px 1px #fff, inset -1px -1px #0a0a0a, inset 2px 2px #dfdfdf, inset -2px -2px #808080" };
    const winBorderIn = { boxShadow: "inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080" };

    if (loading) {
        return (
            <div className=" flex items-center justify-center min-h-screen">
            <div className="p-6  text-black text-sm font-mono" >
                 loading subscription...
            </div>
            </div>
        );
    }

    return (
        <section className="w-full sm:py-0 py-10 overflow-hidden px-6 sm:px-10 lg:px-16  min-h-screen  text-black font-mono border border-t-0 border-r-0 border-b-0 border-black">
            <div className="w-100 h-9"></div>

            {user?.usertype === 'premiummonthly' || user?.usertype === 'premiumlifetime' ? (
                <div className="max-w-4xl">
                    <div className="bg-[#000080] p-8 mb-8 text-white" style={winBorderOut}>
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-4xl mb-2 font-bold">🎉 Premium Active</h3>
                                <p className="text-gray-200 text-lg">You're enjoying all premium benefits</p>
                            </div>
                            <div className="text-6xl">✨</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="p-6 " style={winBorderOut}>
                            <h4 className="text-sm text-blue-900 mb-2 uppercase font-bold">Plan Type</h4>
                            <p className="text-3xl text-black mb-2 bg-white px-2 py-1 border" style={winBorderIn}>
                                {user?.usertype === 'premiumlifetime' ? 'Lifetime' : 'Monthly'}
                            </p>
                            <p className="text-gray-700 text-sm">
                                {user?.usertype === 'premiumlifetime'
                                    ? 'One-time payment for lifetime access'
                                    : 'Renews monthly'}
                            </p>
                        </div>

                        <div className="p-6 " style={winBorderOut}>
                            <h4 className="text-sm text-blue-900 mb-2 uppercase font-bold">Member Since</h4>
                            <p className="text-3xl text-black mb-2 bg-white px-2 py-1 border" style={winBorderIn}>
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                            <p className="text-gray-700 text-sm">Keep enjoying premium features</p>
                        </div>
                    </div>

                    <div className="p-8  mb-8" style={winBorderOut}>
                        <h3 className="text-2xl text-black mb-6 font-bold">Premium Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <span className="text-blue-950 font-bold text-xl mt-1">[✓]</span>
                                <div>
                                    <p className="text-black font-bold">Unlimited File Uploads</p>
                                    <p className="text-sm text-gray-800">Upload & organize unlimited spreadsheets</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-blue-950 font-bold text-xl mt-1">[✓]</span>
                                <div>
                                    <p className="text-black font-bold">Advanced RAG Search</p>
                                    <p className="text-sm text-gray-800">Search across all your files instantly</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-blue-950 font-bold text-xl mt-1">[✓]</span>
                                <div>
                                    <p className="text-black font-bold">Priority Support</p>
                                    <p className="text-sm text-gray-800">Get help from our support team</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-blue-950 font-bold text-xl mt-1">[✓]</span>
                                <div>
                                    <p className="text-black font-bold">Advanced Analytics</p>
                                    <p className="text-sm text-gray-800">Deep insights into your data</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={handleDownloadInvoice}
                            disabled={downloadingInvoice}
                            className="bg-[#c0c0c0] text-black font-bold py-3 active:bg-[#dfdfdf] disabled:opacity-50"
                            style={winBorderOut}
                        >
                            {downloadingInvoice ? '⏳ Downloading...' : '📥 Download Invoice'}
                        </button>

                        {user?.usertype === 'premiummonthly' && (
                            <button
                                onClick={() => handlePayment('enterprise')}
                                className="bg-[#c0c0c0] text-black font-bold py-3 active:bg-[#dfdfdf]"
                                style={winBorderOut}
                            >
                                ⬆️ Upgrade to Lifetime
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl space-y-6">
                    <div className="p-6 cursor-pointer "
                        style={winBorderOut}
                        onClick={() => setSelectedPlan('pro')}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-2xl text-black font-bold">Pro monthly</h3>
                                <p className="text-gray-700 text-sm mt-1">For power users</p>
                            </div>
                            <div className="text-right bg-white border px-3 py-1" style={winBorderIn}>
                                <span className="text-4xl text-black font-bold">₹99</span>
                                <span className="text-gray-700 text-sm">/month</span>
                            </div>
                        </div>

                        <ul className="space-y-2 mb-6 text-sm text-gray-800 bg-white p-2 border" style={winBorderIn}>
                            <li>• Unlimited file uploads</li>
                            <li>• Advanced RAG search</li>
                            <li>• Priority support</li>
                        </ul>

                        <div className="flex items-center gap-3">
                            <input
                                type="radio"
                                name="plan"
                                value="pro"
                                checked={selectedPlan === 'pro'}
                                onChange={(e) => setSelectedPlan(e.target.value)}
                                className="w-4 h-4 accent-[#000080]"
                            />
                            <span className="text-black font-bold">Select Pro Plan</span>
                        </div>
                    </div>

                    <div className="p-6 cursor-pointer "
                        style={winBorderOut}
                        onClick={() => setSelectedPlan('enterprise')}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-2xl text-black font-bold">Pro lifetime</h3>
                                <p className="text-gray-700 text-sm mt-1">For teams & organizations</p>
                            </div>
                            <div className="text-right bg-white border px-3 py-1" style={winBorderIn}>
                                <span className="text-4xl text-black font-bold">₹1000</span>
                                <span className="text-gray-700 text-sm">/life</span>
                            </div>
                        </div>

                        <ul className="space-y-2 mb-6 text-sm text-gray-800 bg-white p-2 border" style={winBorderIn}>
                            <li>• Everything in Pro</li>
                            <li>• Dedicated support</li>
                        </ul>

                        <div className="flex items-center gap-3">
                            <input
                                type="radio"
                                name="plan"
                                value="enterprise"
                                checked={selectedPlan === 'enterprise'}
                                onChange={(e) => setSelectedPlan(e.target.value)}
                                className="w-4 h-4 accent-[#000080]"
                            />
                            <span className="text-black font-bold">Select lifetime Plan</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={!selectedPlan}
                        className="w-full  disabled:opacity-40 text-black font-bold py-3 mt-6 active:bg-[#dfdfdf]"
                        style={winBorderOut}
                    >
                        Proceed to Payment
                    </button>

                    <p className="text-xs text-gray-800 text-center">
                        Secure payment powered by Razorpay
                    </p>
                </div>
            )}
        </section>
    );
}

export default Subs;