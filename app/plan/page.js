"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getSupabaseBrowser } from "../lib/supabase-browser";

const PLAN = {
  name: "Retail Omega Monthly",
  amount: 89,
  currency: "INR",
  features: [
    "Track batches, products, and live stock",
    "Multi-item orders with address capture",
    "Revenue + expense reports",
    "Capital tracking and low-stock alerts",
  ],
};

export default function PlanPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [pollingPayment, setPollingPayment] = useState(false);
  const pollRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function loadSubscription() {
      const response = await fetch("/api/subscription");
      const json = await response.json();
      if (!mounted) return;
      if (response.ok) {
        setSubscription(json.data);
      }
      setLoading(false);
    }

    loadSubscription();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const scriptId = "razorpay-checkout";
    if (document.getElementById(scriptId)) return;
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!pollingPayment) return;

    const pollSubscription = async () => {
      try {
        const response = await fetch("/api/subscription");
        const json = await response.json();
        if (response.ok) {
          setSubscription(json.data);
          if (json.data?.status === "active") {
            setPollingPayment(false);
            setPaying(false);
            router.push("/dashboard");
          }
        }
      } catch (error) {
        toast("Unable to refresh payment status.");
      }
    };

    pollSubscription();
    pollRef.current = window.setInterval(pollSubscription, 4000);

    return () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
      }
    };
  }, [pollingPayment, router]);

  const handlePay = async () => {
    setPaying(true);
    const response = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    if (!response.ok) {
      toast(json.error || "Unable to start payment.");
      setPaying(false);
      return;
    } else {
      window.open(json.url);
      setPollingPayment(true);
    }

    // const { data } = await supabase.auth.getUser();
    // const options = {
    //   key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    //   amount: json.amount,
    //   currency: json.currency,
    //   name: "Retail Omega",
    //   description: PLAN.name,
    //   subscription_id: json.subscription_id,
    //   prefill: { email: data.user?.email || "" },
    //   handler: async (payload) => {
    //     const verifyResponse = await fetch("/api/razorpay/verify", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(payload),
    //     });
    //     const verifyJson = await verifyResponse.json();
    //     if (!verifyResponse.ok) {
    //       toast(verifyJson.error || "Payment verification failed.");
    //       setPaying(false);
    //       return;
    //     }
    //     toast("Payment successful.");
    //     router.push("/");
    //   },
    //   modal: {
    //     ondismiss: () => setPaying(false),
    //   },
    // };

    // const razorpay = new window.Razorpay(options);
    // razorpay.open();
  };

  const isActive = subscription?.status === "active";
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast("Logged out.");
    router.push("/auth");
  };

  return (
    <div className="min-h-screen px-6 py-12 sm:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--sage)]">
              Retail Omega
            </p>
            <h1 className="mt-3 font-serif text-4xl text-[color:var(--ink)]">
              Pricing
            </h1>
            <p className="mt-2 text-sm text-black/60">
              Unlock the workspace once your plan is active.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-black/60">
              {loading
                ? "Checking your plan..."
                : isActive
                  ? "Your plan is active."
                  : "Pay once to unlock all modules."}
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full hover:cursor-pointer border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black/70 transition hover:border-transparent hover:bg-[color:var(--clay)]"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="relative w-full max-w-xl rounded-[28px] border-2 border-[color:var(--ink)] bg-white p-6 shadow-[var(--shadow)]">
            <h2 className="font-serif text-2xl text-[color:var(--ink)]">
              {PLAN.name}
            </h2>
            <p className="mt-3 text-3xl font-semibold text-[color:var(--ink)]">
              Rs {PLAN.amount}
              <span className="ml-1 text-sm font-normal text-black/50">
                /month
              </span>
            </p>
            <p className="mt-3 text-sm text-black/60">
              Monthly plan billed every 30 days.
            </p>
            {isActive ? (
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="mt-6 w-full rounded-full bg-[color:var(--ink)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-black"
              >
                Go to dashboard
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePay}
                disabled={paying || loading}
                className="mt-6 w-full rounded-full bg-[color:var(--ink)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
              >
                {paying ? "Processing..." : "Pay Rs 89"}
              </button>
            )}
            <div className="mt-6 h-px bg-black/10" />
            <ul className="mt-6 space-y-3 text-sm text-black/70">
              {PLAN.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
