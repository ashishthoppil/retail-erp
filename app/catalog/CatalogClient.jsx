"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Facebook,
  Globe,
  Instagram,
  Phone,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

function money(value) {
  if (value == null || value === "") return "";
  const n = Number(value);
  if (Number.isNaN(n)) return `Rs ${value}`;
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white/70">
      <div className="h-52 animate-pulse bg-[color:var(--clay)]/40" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-black/10" />
        <div className="h-4 w-full animate-pulse rounded-full bg-black/5" />
        <div className="h-6 w-1/3 animate-pulse rounded-full bg-black/10" />
      </div>
    </div>
  );
}

export default function CatalogClient({ userId }) {
  const [catalog, setCatalog] = useState({
    business_name: "",
    instagram_url: null,
    facebook_url: null,
    website_url: null,
    phone_number: null,
    show_catalog_price: true,
    show_catalog_description: true,
    products: [],
  });
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function loadCatalog() {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/catalog?user_id=${userId}`);
        const json = await response.json();
        if (!response.ok) {
          setStatus(json.error || "Unable to load catalog.");
          return;
        }
        setCatalog(json.data);
      } catch {
        setStatus("Unable to load catalog. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, [userId]);

  const contacts = useMemo(
    () =>
      [
        catalog.phone_number && {
          icon: Phone,
          label: catalog.phone_number,
          href: `tel:${catalog.phone_number}`,
        },
        catalog.website_url && {
          icon: Globe,
          label: "Website",
          href: catalog.website_url,
        },
        catalog.instagram_url && {
          icon: Instagram,
          label: "Instagram",
          href: catalog.instagram_url,
        },
        catalog.facebook_url && {
          icon: Facebook,
          label: "Facebook",
          href: catalog.facebook_url,
        },
      ].filter(Boolean),
    [catalog]
  );

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog.products;
    return catalog.products.filter((p) =>
      `${p.name} ${p.description || ""}`.toLowerCase().includes(q)
    );
  }, [catalog.products, query]);

  const initials = (catalog.business_name || "Retail Omega")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen px-4 py-8 sm:px-10 sm:py-12">
      {/* Header */}
      <header className="mx-auto w-full max-w-6xl overflow-hidden rounded-[32px] border border-black/10 bg-white/85 shadow-[var(--shadow)] backdrop-blur">
        <div className="h-28 bg-gradient-to-br from-[color:var(--clay)] via-[color:var(--cream)] to-[color:var(--sage)]/40 sm:h-32" />
        <div className="px-6 pb-7 sm:px-9">
          <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-white bg-[color:var(--ink)] text-2xl font-bold text-white shadow-md">
            {initials}
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--sage)]">
            Catalogue
          </p>
          <h1 className="mt-1 font-serif text-4xl text-[color:var(--ink)] sm:text-5xl">
            {catalog.business_name || "Retail Omega"}
          </h1>
          <p className="mt-2 text-sm text-black/55">
            Browse the latest pieces available for order.
          </p>

          {contacts.length ? (
            <div className="mt-5 flex flex-wrap gap-2.5 text-sm">
              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-black/65 transition hover:-translate-y-0.5 hover:border-transparent hover:bg-[color:var(--ink)] hover:text-white"
                >
                  <c.icon className="h-4 w-4" />
                  {c.label}
                </a>
              ))}
            </div>
          ) : null}

          {status ? (
            <p className="mt-4 text-sm font-medium text-[color:var(--copper)]">
              {status}
            </p>
          ) : null}
        </div>
      </header>

      {/* Search */}
      {!loading && catalog.products.length ? (
        <div className="mx-auto mt-6 w-full max-w-6xl">
          <div className="flex items-center gap-3 rounded-full border border-black/10 bg-white/85 px-5 py-3 shadow-sm backdrop-blur">
            <Search className="h-5 w-5 text-black/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full bg-transparent text-sm text-[color:var(--ink)] outline-none placeholder:text-black/40"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-black/40 transition hover:text-black"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Grid */}
      <section className="mx-auto mt-6 grid w-full max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
        ) : products.length ? (
          products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setSelected(product)}
              className="group flex flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white/85 text-left shadow-sm transition hover:-translate-y-1.5 hover:shadow-[var(--shadow)]"
            >
              <div className="relative h-52 overflow-hidden bg-[color:var(--clay)]/50">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[color:var(--ink)]/30">
                    <ShoppingBag className="h-10 w-10" />
                  </div>
                )}
                {catalog.show_catalog_price ? (
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-[color:var(--ink)] shadow-sm backdrop-blur">
                    {money(product.selling_price)}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-serif text-2xl text-[color:var(--ink)]">
                  {product.name}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-black/55">
                  {catalog.show_catalog_description &&
                  product.description?.trim()
                    ? product.description
                    : "Tap to view details."}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--copper)] opacity-0 transition group-hover:opacity-100">
                  View details →
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-full rounded-[28px] border border-dashed border-black/15 bg-white/70 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--cream)] text-[color:var(--copper)]">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <p className="mt-4 font-serif text-2xl text-[color:var(--ink)]">
              {query ? "No matching products" : "No products yet"}
            </p>
            <p className="mt-1 text-sm text-black/55">
              {query
                ? "Try a different search term."
                : "Check back soon for new pieces."}
            </p>
          </div>
        )}
      </section>

      {/* Detail modal */}
      {selected ? (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[32px] bg-white p-6 shadow-[var(--shadow)] sm:rounded-[32px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--sage)]">
                  Product
                </p>
                <h3 className="mt-2 font-serif text-3xl text-[color:var(--ink)]">
                  {selected.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 text-black/55 transition hover:bg-black/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-3xl border border-black/10 bg-[color:var(--clay)]/40">
              {selected.image_url ? (
                <img
                  src={selected.image_url}
                  alt={selected.name}
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center text-[color:var(--ink)]/30">
                  <ShoppingBag className="h-12 w-12" />
                </div>
              )}
            </div>

            {catalog.show_catalog_price ? (
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-[color:var(--cream)] px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                  Price
                </span>
                <span className="font-serif text-2xl text-[color:var(--ink)]">
                  {money(selected.selling_price)}
                </span>
              </div>
            ) : null}

            {catalog.show_catalog_description && selected.description?.trim() ? (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                  Description
                </p>
                <p className="mt-2 text-sm leading-relaxed text-black/70">
                  {selected.description}
                </p>
              </div>
            ) : null}

            {catalog.phone_number ? (
              <a
                href={`tel:${catalog.phone_number}`}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--ink)] px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Phone className="h-4 w-4" />
                Contact to order
              </a>
            ) : (
              <p className="mt-6 text-center text-sm text-black/55">
                Contact the business to place an order.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
