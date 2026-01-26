"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CapitalCard() {
  const [amount, setAmount] = useState("");
  const [current, setCurrent] = useState(null);
  const [status, setStatus] = useState("");
  const [capitalSaving, setCapitalSaving] = useState(false);

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

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");
    setCapitalSaving(true);
    const response = await fetch("/api/capital", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const json = await response.json();
    if (!response.ok) {
      setStatus(json.error || "Unable to save capital.");
      setCapitalSaving(false);
      return;
    }
    setCurrent(json.data);
    setAmount("");
    toast("Capital updated.");
    setCapitalSaving(false);
  }

  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(current?.amount || 0);

  return (
    <section className="rounded-[28px] border border-black/10 bg-white/85 p-6 shadow-sm">
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
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 justify-end">
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
            className="rounded-full bg-[color:var(--ink)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            disabled={capitalSaving}
          >
            {capitalSaving
              ? "Saving..."
              : current
                ? "Add more capital"
                : "Save"}
          </button>
        </form>
      </div>
      {status ? (
        <p className="mt-3 text-sm text-[color:var(--copper)]">{status}</p>
      ) : null}
    </section>
  );
}
