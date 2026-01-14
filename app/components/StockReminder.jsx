"use client";

import { useEffect, useMemo, useState } from "react";

export default function StockReminder() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadProducts() {
      const response = await fetch("/api/products");
      const json = await response.json();
      if (!response.ok) {
        setStatus(json.error || "Unable to load stock.");
        return;
      }
      setProducts(json.data || []);
    }
    loadProducts();
  }, []);

  const { remainingPercent, shouldWarn } = useMemo(() => {
    const totals = products.reduce(
      (acc, item) => {
        acc.initial += Number(item.initial_quantity || 0);
        acc.current += Number(item.current_quantity || 0);
        return acc;
      },
      { initial: 0, current: 0 }
    );

    if (totals.initial === 0) {
      return { remainingPercent: 100, shouldWarn: false };
    }

    const percent = (totals.current / totals.initial) * 100;
    return { remainingPercent: percent, shouldWarn: percent < 25 };
  }, [products]);

  if (!shouldWarn) {
    return null;
  }

  return (
    <section className="rounded-[28px] border border-black/10 bg-[color:var(--clay)] p-5 text-sm text-black/70 shadow-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-black/50">
        Restock reminder
      </p>
      <p className="mt-2 font-medium text-[color:var(--ink)]">
        Total stock is at {remainingPercent.toFixed(1)}% of the initial level.
      </p>
      <p className="mt-1 text-sm text-black/60">
        Consider placing a restock order soon.
      </p>
      {status ? <p className="mt-2 text-xs text-black/50">{status}</p> : null}
    </section>
  );
}
