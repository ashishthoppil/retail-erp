"use client";

import { useEffect, useState } from "react";

const emptyOrder = {
  quantity: "",
  selling_price: "",
  shipping_charge: "",
};

export default function PlaceOrderClient() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [order, setOrder] = useState(emptyOrder);
  const [status, setStatus] = useState("");

  async function loadProducts() {
    const response = await fetch("/api/products");
    const json = await response.json();
    if (json.error) {
      setStatus(json.error);
      return;
    }
    setProducts(json.data || []);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openModal(product) {
    setSelected(product);
    setOrder({
      quantity: "",
      selling_price: product.selling_price ?? "",
      shipping_charge: "",
    });
  }

  function closeModal() {
    setSelected(null);
    setOrder(emptyOrder);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selected) return;
    setStatus("");
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: selected.id,
        ...order,
      }),
    });
    const json = await response.json();
    if (!response.ok) {
      setStatus(json.error || "Unable to place order.");
      return;
    }
    closeModal();
    loadProducts();
  }

  return (
    <div className="space-y-6">
      {status ? (
        <div className="rounded-2xl bg-[color:var(--clay)] px-4 py-3 text-sm text-black/70">
          {status}
        </div>
      ) : null}
      <section className="rounded-[28px] border border-black/10 bg-white/80 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-[color:var(--ink)]">
              Ready-to-sell products
            </h2>
            <p className="mt-1 text-sm text-black/60">
              Click any item to record a sale.
            </p>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.2em] text-black/45">
                <th className="py-3">Product</th>
                <th>Batch</th>
                <th>Selling</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {products.map((item) => (
                <tr key={item.id} className="text-black/70">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-2xl bg-[color:var(--clay)]">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-medium text-[color:var(--ink)]">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{item.batches?.name || "—"}</td>
                  <td>{item.selling_price}</td>
                  <td>{item.quantity}</td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => openModal(item)}
                      className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold text-black transition hover:border-transparent hover:bg-[color:var(--clay)]"
                    >
                      Place order
                    </button>
                  </td>
                </tr>
              ))}
              {!products.length ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-sm text-black/50"
                  >
                    No products yet. Add items first.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {selected ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-[var(--shadow)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Place order
                </p>
                <h3 className="mt-2 font-serif text-2xl text-[color:var(--ink)]">
                  {selected.name}
                </h3>
                <p className="mt-1 text-sm text-black/60">
                  Available: {selected.quantity}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/60"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Quantity
                </label>
                <input
                  value={order.quantity}
                  onChange={(event) =>
                    setOrder((prev) => ({
                      ...prev,
                      quantity: event.target.value,
                    }))
                  }
                  type="number"
                  min="1"
                  step="1"
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Selling price
                </label>
                <input
                  value={order.selling_price}
                  onChange={(event) =>
                    setOrder((prev) => ({
                      ...prev,
                      selling_price: event.target.value,
                    }))
                  }
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Shipping charge
                </label>
                <input
                  value={order.shipping_charge}
                  onChange={(event) =>
                    setOrder((prev) => ({
                      ...prev,
                      shipping_charge: event.target.value,
                    }))
                  }
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-[color:var(--ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                Save order
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
