"use client";

import { useEffect, useState } from "react";
import Toast from "./Toast";

export default function CapitalCard() {
  const [amount, setAmount] = useState("");
  const [current, setCurrent] = useState(null);
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState({ message: "", visible: false });

  useEffect(() => {
    async function loadCapital() {
      const response = await fetch("/api/capital");
      const json = await response.json();
      if (!response.ok) {
        setStatus(json.error || "Unable to load capital.");
        return;
      }
      setCurrent(json.data);
    }
    loadCapital();
  }, []);

  function showToast(message) {
    setToast({ message, visible: true });
    window.setTimeout(() => {
      setToast({ message: "", visible: false });
    }, 2400);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");
    const response = await fetch("/api/capital", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const json = await response.json();
    if (!response.ok) {
      setStatus(json.error || "Unable to save capital.");
      return;
    }
    setCurrent(json.data);
    setAmount("");
    showToast("Capital updated.");
  }

  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(current?.amount || 0);

  return (
    <section className="rounded-[28px] border border-black/10 bg-white/85 p-6 shadow-sm">
      <Toast message={toast.message} visible={toast.visible} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-black/50">
            {current ? "Current capital" : "Initial capital"}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-[color:var(--ink)]">
            {formatted}
          </h2>
          <p className="mt-2 text-sm text-black/60">
            {current
              ? "Add or subtract to adjust your available capital."
              : "Set the starting cash for inventory."}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            type="number"
            step="0.01"
            placeholder={current ? "Add more capital" : "Enter amount"}
            className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm focus:border-[color:var(--sage)] focus:outline-none"
            required
          />
          <button
            type="submit"
            className="rounded-full bg-[color:var(--ink)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-black"
          >
            {current ? "Add more capital" : "Save"}
          </button>
        </form>
      </div>
      {status ? (
        <p className="mt-3 text-sm text-[color:var(--copper)]">{status}</p>
      ) : null}
    </section>
  );
}
