"use client";

import { useEffect, useMemo, useState } from "react";
import Toast from "../components/Toast";

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
  const [productFile, setProductFile] = useState(null);
  const [toast, setToast] = useState({ message: "", visible: false });
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingBatchId, setEditingBatchId] = useState(null);
  const [editingBatchName, setEditingBatchName] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingProductFile, setEditingProductFile] = useState(null);
  const [status, setStatus] = useState("");

  const imagePreview = useMemo(() => {
    if (productFile) {
      return URL.createObjectURL(productFile);
    }
    return product.image_url?.trim() ? product.image_url : null;
  }, [product.image_url, productFile]);

  useEffect(() => {
    return () => {
      if (imagePreview && productFile) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, productFile]);

  function showToast(message) {
    setToast({ message, visible: true });
    window.setTimeout(() => {
      setToast({ message: "", visible: false });
    }, 2400);
  }

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
    showToast("Batch saved.");
  }

  function startBatchEdit(batch) {
    setEditingBatchId(batch.id);
    setEditingBatchName(batch.name);
  }

  function cancelBatchEdit() {
    setEditingBatchId(null);
    setEditingBatchName("");
  }

  async function handleBatchUpdate(batchId) {
    setStatus("");
    const response = await fetch("/api/batches", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: batchId, name: editingBatchName }),
    });
    const json = await response.json();
    if (!response.ok) {
      setStatus(json.error || "Unable to update batch.");
      return;
    }
    setBatches((prev) =>
      prev.map((item) => (item.id === batchId ? json.data : item))
    );
    cancelBatchEdit();
    showToast("Batch updated.");
  }

  async function handleBatchDelete(batchId) {
    const confirmed = window.confirm("Delete this batch?");
    if (!confirmed) return;
    setStatus("");
    const response = await fetch("/api/batches", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: batchId }),
    });
    const json = await response.json();
    if (!response.ok) {
      setStatus(json.error || "Unable to delete batch.");
      return;
    }
    setBatches((prev) => prev.filter((item) => item.id !== batchId));
    showToast("Batch deleted.");
  }

  async function handleProductSubmit(event) {
    event.preventDefault();
    setStatus("");
    let image_url = product.image_url?.trim() || null;

    if (productFile) {
      const formData = new FormData();
      formData.append("file", productFile);
      const uploadResponse = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const uploadJson = await uploadResponse.json();
      if (!uploadResponse.ok) {
        setStatus(uploadJson.error || "Unable to upload image.");
        return;
      }
      image_url = uploadJson.data?.publicUrl || image_url;
    }

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, image_url }),
    });
    const json = await response.json();
    if (!response.ok) {
      setStatus(json.error || "Unable to save product.");
      return;
    }
    setProduct(emptyProduct);
    setProductFile(null);
    setProducts((prev) => [json.data, ...prev]);
    showToast("Product saved.");
  }

  function startProductEdit(item) {
    setEditingProductId(item.id);
    setEditingProduct({
      batch_id: item.batch_id || "",
      image_url: item.image_url || "",
      name: item.name || "",
      buying_price: item.buying_price ?? "",
      selling_price: item.selling_price ?? "",
      quantity: item.quantity ?? "",
    });
    setEditingProductFile(null);
  }

  function cancelProductEdit() {
    setEditingProductId(null);
    setEditingProduct(null);
    setEditingProductFile(null);
  }

  async function handleProductUpdate(productId) {
    if (!editingProduct) return;
    setStatus("");
    let image_url = editingProduct.image_url?.trim() || null;

    if (editingProductFile) {
      const formData = new FormData();
      formData.append("file", editingProductFile);
      const uploadResponse = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const uploadJson = await uploadResponse.json();
      if (!uploadResponse.ok) {
        setStatus(uploadJson.error || "Unable to upload image.");
        return;
      }
      image_url = uploadJson.data?.publicUrl || image_url;
    }

    const response = await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId, ...editingProduct, image_url }),
    });
    const json = await response.json();
    if (!response.ok) {
      setStatus(json.error || "Unable to update product.");
      return;
    }
    setProducts((prev) =>
      prev.map((item) => (item.id === productId ? json.data : item))
    );
    cancelProductEdit();
    showToast("Product updated.");
  }

  async function handleProductDelete(productId) {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;
    setStatus("");
    const response = await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId }),
    });
    const json = await response.json();
    if (!response.ok) {
      setStatus(json.error || "Unable to delete product.");
      return;
    }
    setProducts((prev) => prev.filter((item) => item.id !== productId));
    showToast("Product deleted.");
  }

  return (
    <div className="space-y-10">
      <Toast message={toast.message} visible={toast.visible} />
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
          <div className="mt-6 overflow-x-auto rounded-2xl border border-black/10 bg-white">
            <table className="w-full min-w-[320px] text-left text-xs">
              <thead className="bg-black/5 uppercase tracking-[0.2em] text-black/45">
                <tr>
                  <th className="px-4 py-3">Batch</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {batches.slice(0, 6).map((batch) => (
                  <tr key={batch.id} className="text-black/70">
                    <td className="px-4 py-3">
                      {editingBatchId === batch.id ? (
                        <input
                          value={editingBatchName}
                          onChange={(event) =>
                            setEditingBatchName(event.target.value)
                          }
                          className="w-full rounded-xl border border-black/10 px-3 py-2 text-xs focus:border-[color:var(--sage)] focus:outline-none"
                        />
                      ) : (
                        <span className="font-medium text-[color:var(--ink)]">
                          {batch.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editingBatchId === batch.id ? (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleBatchUpdate(batch.id)}
                            className="rounded-full bg-[color:var(--ink)] px-3 py-1 text-[10px] font-semibold text-white"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelBatchEdit}
                            className="rounded-full border border-black/20 px-3 py-1 text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startBatchEdit(batch)}
                            className="rounded-full border border-black/15 px-3 py-1 text-[10px] font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBatchDelete(batch.id)}
                            className="rounded-full border border-black/10 px-3 py-1 text-[10px] text-black/60"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {!batches.length ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-4 text-center text-[11px] text-black/40"
                    >
                      No batches yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
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
                Product image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setProductFile(event.target.files?.[0] || null)}
                className="rounded-2xl border border-dashed border-black/20 bg-white px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
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
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {products.map((item) => {
                const isEditing = editingProductId === item.id;
                return (
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
                          {isEditing ? (
                            <input
                              value={editingProduct?.name || ""}
                              onChange={(event) =>
                                setEditingProduct((prev) => ({
                                  ...prev,
                                  name: event.target.value,
                                }))
                              }
                              className="rounded-xl border border-black/10 px-3 py-2 text-xs focus:border-[color:var(--sage)] focus:outline-none"
                            />
                          ) : (
                            <p className="font-medium text-[color:var(--ink)]">
                              {item.name}
                            </p>
                          )}
                          {isEditing ? (
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) =>
                                setEditingProductFile(
                                  event.target.files?.[0] || null
                                )
                              }
                              className="mt-2 w-full rounded-xl border border-dashed border-black/20 px-3 py-2 text-[11px] focus:border-[color:var(--sage)] focus:outline-none"
                            />
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td>
                      {isEditing ? (
                        <select
                          value={editingProduct?.batch_id || ""}
                          onChange={(event) =>
                            setEditingProduct((prev) => ({
                              ...prev,
                              batch_id: event.target.value,
                            }))
                          }
                          className="rounded-xl border border-black/10 px-3 py-2 text-xs focus:border-[color:var(--sage)] focus:outline-none"
                        >
                          <option value="">Select</option>
                          {batches.map((batch) => (
                            <option key={batch.id} value={batch.id}>
                              {batch.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        item.batches?.name || "—"
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingProduct?.buying_price ?? ""}
                          onChange={(event) =>
                            setEditingProduct((prev) => ({
                              ...prev,
                              buying_price: event.target.value,
                            }))
                          }
                          className="w-24 rounded-xl border border-black/10 px-3 py-2 text-xs focus:border-[color:var(--sage)] focus:outline-none"
                        />
                      ) : (
                        item.buying_price
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingProduct?.selling_price ?? ""}
                          onChange={(event) =>
                            setEditingProduct((prev) => ({
                              ...prev,
                              selling_price: event.target.value,
                            }))
                          }
                          className="w-24 rounded-xl border border-black/10 px-3 py-2 text-xs focus:border-[color:var(--sage)] focus:outline-none"
                        />
                      ) : (
                        item.selling_price
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={editingProduct?.quantity ?? ""}
                          onChange={(event) =>
                            setEditingProduct((prev) => ({
                              ...prev,
                              quantity: event.target.value,
                            }))
                          }
                          className="w-20 rounded-xl border border-black/10 px-3 py-2 text-xs focus:border-[color:var(--sage)] focus:outline-none"
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td className="text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleProductUpdate(item.id)}
                            className="rounded-full bg-[color:var(--ink)] px-3 py-1 text-[10px] font-semibold text-white"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelProductEdit}
                            className="rounded-full border border-black/20 px-3 py-1 text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startProductEdit(item)}
                            className="rounded-full border border-black/15 px-3 py-1 text-[10px] font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleProductDelete(item.id)}
                            className="rounded-full border border-black/10 px-3 py-1 text-[10px] text-black/60"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!products.length ? (
                <tr>
                  <td
                    colSpan={6}
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
