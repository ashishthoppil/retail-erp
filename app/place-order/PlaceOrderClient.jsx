"use client";

import { useEffect, useMemo, useState } from "react";
import Toast from "../components/Toast";
import { PlusCircleIcon } from "lucide-react";

const PAGE_SIZE = 10;

const emptyLine = {
  product_id: "",
  product_name: "",
  quantity: 1,
  selling_price: "",
};

export default function PlaceOrderClient() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState({ message: "", visible: false });
  const [productQuery, setProductQuery] = useState("");
  const [productPage, setProductPage] = useState(1);
  const [productsLoading, setProductsLoading] = useState(true);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [orderLines, setOrderLines] = useState([emptyLine]);
  const [address, setAddress] = useState("");
  const [orderSaving, setOrderSaving] = useState(false);
  const [lineErrors, setLineErrors] = useState({});

  async function loadProducts() {
    setProductsLoading(true);
    const response = await fetch("/api/products");
    const json = await response.json();
    if (json.error) {
      setStatus(json.error);
      setProductsLoading(false);
      return;
    }
    setProducts(json.data || []);
    setProductsLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    setProductPage(1);
  }, [productQuery]);

  function showToast(message) {
    setToast({ message, visible: true });
    window.setTimeout(() => {
      setToast({ message: "", visible: false });
    }, 2400);
  }

  function openOrderModal() {
    setIsOrderOpen(true);
    setOrderLines([emptyLine]);
    setAddress("");
    setLineErrors({});
  }

  function closeOrderModal() {
    setIsOrderOpen(false);
    setLineErrors({});
  }

  function addLine() {
    setOrderLines((prev) => [...prev, emptyLine]);
  }

  function updateLine(index, updates) {
    setOrderLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, ...updates } : line))
    );
  }

  function handleProductNameChange(index, value) {
    const trimmed = value.trim();
    const match = products.find(
      (item) => item.name?.toLowerCase() === trimmed.toLowerCase()
    );
    if (match) {
      updateLine(index, {
        product_id: match.id,
        product_name: match.name,
        selling_price: match.selling_price ?? "",
      });
      return;
    }
    updateLine(index, { product_name: value, product_id: "" });
  }

  async function handleOrderSubmit(event) {
    event.preventDefault();
    setStatus("");
    setOrderSaving(true);
    setLineErrors({});

    const errors = {};
    for (let i = 0; i < orderLines.length; i += 1) {
      const line = orderLines[i];
      const product = products.find((item) => item.id === line.product_id);
      const quantity = Number(line.quantity || 0);
      if (!product || Number.isNaN(quantity) || quantity <= 0) {
        errors[i] = "invalid";
        continue;
      }
      if (quantity > Number(product.current_quantity || 0)) {
        errors[i] = "stock";
      }
    }

    if (Object.keys(errors).length) {
      setLineErrors(errors);
      alert("Some products are out of stock or invalid. Please adjust.");
      setOrderSaving(false);
      return;
    }

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        shipping_charge: 0,
        items: orderLines.map((line) => ({
          product_id: line.product_id,
          quantity: Number(line.quantity),
          selling_price: Number(line.selling_price),
        })),
      }),
    });
    const json = await response.json();
    if (!response.ok) {
      if (json?.out_of_stock?.length) {
        const errorMap = {};
        json.out_of_stock.forEach((item) => {
          const index = orderLines.findIndex(
            (line) => line.product_id === item.product_id
          );
          if (index !== -1) {
            errorMap[index] = "stock";
          }
        });
        setLineErrors(errorMap);
        alert("Some products are out of stock. Please adjust.");
      } else {
        setStatus(json.error || "Unable to place order.");
      }
      setOrderSaving(false);
      return;
    }

    await loadProducts();
    showToast("Order saved.");
    closeOrderModal();
    setOrderSaving(false);
  }

  const filteredProducts = useMemo(() => {
    const query = productQuery.trim().toLowerCase();
    if (!query) return products;
    return products.filter((item) => item.name?.toLowerCase().includes(query));
  }, [products, productQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  useEffect(() => {
    setProductPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const pagedProducts = filteredProducts.slice(
    (productPage - 1) * PAGE_SIZE,
    productPage * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      <Toast message={toast.message} visible={toast.visible} />
      {status ? (
        <div className="rounded-2xl bg-[color:var(--clay)] px-4 py-3 text-sm text-black/70">
          {status}
        </div>
      ) : null}
      <section className="rounded-[28px] border border-black/10 bg-white/80 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
            <h2 className="font-serif text-2xl text-[color:var(--ink)]">
              Ready-to-sell products
            </h2>
            <p className="mt-1 text-sm text-black/60">
              Review current stock and place new orders.
            </p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
              <input
                value={productQuery}
                onChange={(event) => setProductQuery(event.target.value)}
                placeholder="Search by item name"
                className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/70 focus:border-[color:var(--sage)] focus:outline-none sm:w-64"
              />
              <button
                type="button"
                onClick={openOrderModal}
                className="hover:cursor-pointer flex gap-1 items-center rounded-full bg-[color:var(--ink)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
                disabled={productsLoading}
              >
                <PlusCircleIcon className="text-white h-4" />
                Place an order
              </button>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {productsLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-sm text-black/50"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : null}
              {pagedProducts.map((item) => (
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
                  <td>{item.batches?.name || "-"}</td>
                  <td>{item.selling_price}</td>
                  <td>{item.current_quantity}</td>
                </tr>
              ))}
              {!productsLoading && !filteredProducts.length ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-10 text-center text-sm text-black/50"
                  >
                    No products yet. Add items first.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-black/60">
          <span>
            Page {productPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setProductPage((prev) => Math.max(1, prev - 1))}
              disabled={productPage === 1}
              className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() =>
                setProductPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={productPage === totalPages}
              className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {isOrderOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-[var(--shadow)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Place order
                </p>
                <h3 className="mt-2 font-serif text-2xl text-[color:var(--ink)]">
                  New order
                </h3>
              </div>
              <button
                type="button"
                onClick={closeOrderModal}
                className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/60"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleOrderSubmit} className="mt-6 space-y-5">
              {orderLines.map((line, index) => (
                <div
                  key={`line-${index}`}
                  className="grid gap-3 rounded-2xl border border-black/10 bg-white/80 p-4 md:grid-cols-[1.4fr_0.6fr_0.8fr]"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-black/50">
                      Product
                    </label>
                    <input
                      list="product-options"
                      value={line.product_name}
                      onChange={(event) =>
                        handleProductNameChange(index, event.target.value)
                      }
                      placeholder="Select product"
                      className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-black/50">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={line.quantity}
                      onChange={(event) =>
                        updateLine(index, { quantity: event.target.value })
                      }
                      className={`rounded-2xl border bg-white px-4 py-3 text-sm focus:outline-none ${
                        lineErrors[index]
                          ? "border-[color:var(--copper)]"
                          : "border-black/10 focus:border-[color:var(--sage)]"
                      }`}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-black/50">
                      Selling price
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.selling_price}
                      onChange={(event) =>
                        updateLine(index, { selling_price: event.target.value })
                      }
                      className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none w-full"
                      required
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addLine}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-black/70"
                >
                  <PlusCircleIcon className="hover:cursor-pointer text-black/70" />
                </button>
              </div>

              <datalist id="product-options">
                {products.map((product) => (
                  <option key={product.id} value={product.name} />
                ))}
              </datalist>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Address
                </label>
                <textarea
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  rows={3}
                  placeholder="Shipping address"
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-[color:var(--ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
                disabled={orderSaving}
              >
                {orderSaving ? "Saving..." : "Save order"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
