"use client";

import { useEffect, useMemo, useState } from "react";

const emptyProduct = {
  batch_id: "",
  image_url: "",
  name: "",
  buying_price: "",
  selling_price: "",
  quantity: "",
};

export default function AddStockClient() {
  const [batchName, setBatchName] = useState("");
  const [product, setProduct] = useState(emptyProduct);
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("");

  const imagePreview = useMemo(() => {
    return product.image_url?.trim() ? product.image_url : null;
  }, [product.image_url]);

  async function loadData() {
    const [batchRes, productRes] = await Promise.all([
      fetch("/api/batches"),
      fetch("/api/products"),
    ]);

    const batchJson = await batchRes.json();
    const productJson = await productRes.json();

    if (batchJson.error) {
      setStatus(batchJson.error);
    } else {
      setBatches(batchJson.data || []);
    }

    if (productJson.error) {
      setStatus(productJson.error);
    } else {
      setProducts(productJson.data || []);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleBatchSubmit(event) {
    event.preventDefault();
    setStatus("");
    const response = await fetch("/api/batches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: batchName }),
    });
    const json = await response.json();
    if (!response.ok) {
      setStatus(json.error || "Unable to save batch.");
      return;
    }
    setBatchName("");
    setBatches((prev) => [json.data, ...prev]);
  }

  async function handleProductSubmit(event) {
    event.preventDefault();
    setStatus("");
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    const json = await response.json();
    if (!response.ok) {
      setStatus(json.error || "Unable to save product.");
      return;
    }
    setProduct(emptyProduct);
    setProducts((prev) => [json.data, ...prev]);
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <form
          onSubmit={handleBatchSubmit}
          className="rounded-[28px] border border-black/10 bg-white/80 p-6 shadow-sm"
        >
          <h2 className="font-serif text-2xl text-[color:var(--ink)]">
            Create a batch
          </h2>
          <p className="mt-2 text-sm text-black/60">
            Batches group items that arrive together.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <label className="text-xs uppercase tracking-[0.2em] text-black/50">
              Batch name
            </label>
            <input
              value={batchName}
              onChange={(event) => setBatchName(event.target.value)}
              placeholder="Spring showroom drop"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-[color:var(--ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
          >
            Save Batch
          </button>
        </form>

        <form
          onSubmit={handleProductSubmit}
          className="rounded-[28px] border border-black/10 bg-white/80 p-6 shadow-sm"
        >
          <h2 className="font-serif text-2xl text-[color:var(--ink)]">
            Add product details
          </h2>
          <p className="mt-2 text-sm text-black/60">
            Capture pricing, quantities, and a quick image reference.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-black/50">
                Batch
              </label>
              <select
                value={product.batch_id}
                onChange={(event) =>
                  setProduct((prev) => ({
                    ...prev,
                    batch_id: event.target.value,
                  }))
                }
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
                required
              >
                <option value="">Select batch</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-black/50">
                Product image URL
              </label>
              <input
                value={product.image_url}
                onChange={(event) =>
                  setProduct((prev) => ({
                    ...prev,
                    image_url: event.target.value,
                  }))
                }
                placeholder="https://..."
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-black/50">
                Product name
              </label>
              <input
                value={product.name}
                onChange={(event) =>
                  setProduct((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Rustic clay vase"
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-black/50">
                Buying price
              </label>
              <input
                value={product.buying_price}
                onChange={(event) =>
                  setProduct((prev) => ({
                    ...prev,
                    buying_price: event.target.value,
                  }))
                }
                type="number"
                min="0"
                step="0.01"
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-black/50">
                Selling price
              </label>
              <input
                value={product.selling_price}
                onChange={(event) =>
                  setProduct((prev) => ({
                    ...prev,
                    selling_price: event.target.value,
                  }))
                }
                type="number"
                min="0"
                step="0.01"
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-black/50">
                Quantity
              </label>
              <input
                value={product.quantity}
                onChange={(event) =>
                  setProduct((prev) => ({
                    ...prev,
                    quantity: event.target.value,
                  }))
                }
                type="number"
                min="0"
                step="1"
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
                required
              />
            </div>
          </div>
          {imagePreview ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-black/5">
              <img
                src={imagePreview}
                alt="Product preview"
                className="h-40 w-full object-cover"
              />
            </div>
          ) : null}
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-[color:var(--ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
          >
            Save Product
          </button>
        </form>
      </section>

      <section className="rounded-[28px] border border-black/10 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl text-[color:var(--ink)]">
              Current inventory
            </h2>
            <p className="mt-1 text-sm text-black/60">
              All items captured through the form above.
            </p>
          </div>
          {status ? (
            <span className="rounded-full bg-[color:var(--clay)] px-4 py-1 text-xs text-black/70">
              {status}
            </span>
          ) : null}
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.2em] text-black/45">
                <th className="py-3">Product</th>
                <th>Batch</th>
                <th>Buying</th>
                <th>Selling</th>
                <th>Quantity</th>
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
                  <td>{item.buying_price}</td>
                  <td>{item.selling_price}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
              {!products.length ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-sm text-black/50"
                  >
                    No products yet. Add your first batch above.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
