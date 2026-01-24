"use client";

import { useEffect, useState } from "react";

export default function CatalogClient({ userId }) {
  const [catalog, setCatalog] = useState({ business_name: "", products: [] });
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadCatalog() {
      if (!userId) return;
      const response = await fetch(`/api/catalog?user_id=${userId}`);
      const json = await response.json();
      if (!response.ok) {
        setStatus(json.error || "Unable to load catalog.");
        return;
      }
      setCatalog(json.data);
    }
    loadCatalog();
  }, [userId]);

  return (
    <div className="min-h-screen px-6 py-12 sm:px-10">
      <header className="mx-auto w-full max-w-6xl rounded-[32px] border border-black/10 bg-white/85 p-8 shadow-[var(--shadow)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--sage)]">
          Catalog
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[color:var(--ink)]">
          {catalog.business_name || "Retail Omega"}
        </h1>
        <p className="mt-2 text-sm text-black/60">
          Browse the latest pieces available for order.
        </p>
        {status ? (
          <p className="mt-4 text-sm text-[color:var(--copper)]">{status}</p>
        ) : null}
      </header>

      <section className="mx-auto mt-10 grid w-full max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.products.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => setSelected(product)}
            className="group flex flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white/80 text-left shadow-sm transition hover:-translate-y-1 hover:border-transparent hover:bg-[color:var(--clay)]"
          >
            <div className="h-48 bg-[color:var(--clay)]">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="p-5">
              <h2 className="font-serif text-2xl text-[color:var(--ink)]">
                {product.name}
              </h2>
              <p className="mt-2 text-sm text-black/60">
                Tap to view details.
              </p>
              <p className="mt-4 text-lg font-semibold text-[color:var(--ink)]">
                Rs {product.selling_price}
              </p>
            </div>
          </button>
        ))}
      </section>

      {selected ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-[var(--shadow)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Product
                </p>
                <h3 className="mt-2 font-serif text-2xl text-[color:var(--ink)]">
                  {selected.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/60"
              >
                Close
              </button>
            </div>
            {selected.image_url ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
                <img
                  src={selected.image_url}
                  alt={selected.name}
                  className="h-56 w-full object-cover"
                />
              </div>
            ) : null}
            <div className="mt-4 rounded-2xl border border-black/10 bg-white/80 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                Price
              </p>
              <p className="mt-2 text-lg font-semibold text-[color:var(--ink)]">
                Rs {selected.selling_price}
              </p>
            </div>
            <p className="mt-4 text-sm text-black/60">
              Contact the studio to place an order.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
