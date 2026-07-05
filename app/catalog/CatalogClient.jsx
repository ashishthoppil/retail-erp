"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  Facebook,
  Globe,
  Instagram,
  Phone,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import Card from "../components/marketing/Card";

function money(value) {
  if (value == null || value === "") return "";
  const n = Number(value);
  if (Number.isNaN(n)) return `Rs ${value}`;
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

function CardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-52 animate-pulse bg-slate-100" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-100" />
        <div className="h-4 w-full animate-pulse rounded-full bg-slate-50" />
        <div className="h-6 w-1/3 animate-pulse rounded-full bg-slate-100" />
      </div>
    </Card>
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
  const [sort, setSort] = useState("newest");
  const closeButtonRef = useRef(null);

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

  // Modal accessibility: close on Escape, lock scroll, move focus in.
  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected]);

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
    let list = catalog.products;
    if (q) {
      list = list.filter((p) =>
        `${p.name} ${p.description || ""}`.toLowerCase().includes(q)
      );
    }
    if (sort === "newest") return list;
    const sorted = [...list];
    if (sort === "price-asc") {
      sorted.sort(
        (a, b) => (Number(a.selling_price) || 0) - (Number(b.selling_price) || 0)
      );
    } else if (sort === "price-desc") {
      sorted.sort(
        (a, b) => (Number(b.selling_price) || 0) - (Number(a.selling_price) || 0)
      );
    } else if (sort === "name") {
      sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
    return sorted;
  }, [catalog.products, query, sort]);

  const initials = (catalog.business_name || "Retail Omega")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-white px-4 py-8 text-slate-900 sm:px-10 sm:py-12">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-40 top-32 h-[28rem] w-[28rem] rounded-full bg-green-500/10 blur-3xl" />
      </div>

      {/* Business header */}
      <Card as="header" className="mx-auto w-full max-w-6xl overflow-hidden shadow-xl">
        <div className="h-28 bg-brand-gradient sm:h-32">
          <div className="h-full w-full bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
        </div>
        <div className="px-6 pb-7 sm:px-9">
          <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-white bg-slate-900 text-2xl font-bold text-white shadow-lg">
            {initials}
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-green">
            Catalogue
          </p>
          <h1 className="mt-1 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            {catalog.business_name || "Retail Omega"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
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
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 font-medium text-slate-600 transition hover:-translate-y-0.5 hover:border-transparent hover:bg-slate-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
                >
                  <c.icon className="h-4 w-4" aria-hidden="true" />
                  {c.label}
                </a>
              ))}
            </div>
          ) : null}

          {status ? (
            <p className="mt-4 text-sm font-medium text-red-500" role="alert">
              {status}
            </p>
          ) : null}
        </div>
      </Card>

      {/* Search + sort */}
      {!loading && catalog.products.length ? (
        <div className="mx-auto mt-6 flex w-full max-w-6xl flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm focus-within:border-brand-blue">
            <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="rounded-full text-slate-400 transition hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <label className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm focus-within:border-brand-blue">
            <ArrowUpDown className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="sr-only">Sort products</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-slate-700 outline-none sm:w-auto"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      {/* Product grid */}
      <section
        aria-label="Products"
        className="mx-auto mt-6 grid w-full max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
        ) : products.length ? (
          products.map((product) => (
            <Card
              as="button"
              key={product.id}
              type="button"
              onClick={() => setSelected(product)}
              className="group flex flex-col overflow-hidden text-left transition hover:-translate-y-1.5 hover:border-transparent hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              <div className="relative h-52 overflow-hidden bg-slate-100">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <ShoppingBag className="h-10 w-10" aria-hidden="true" />
                  </div>
                )}
                {catalog.show_catalog_price ? (
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-slate-900 shadow-sm backdrop-blur">
                    {money(product.selling_price)}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-lg font-bold text-slate-900">
                  {product.name}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                  {catalog.show_catalog_description &&
                  product.description?.trim()
                    ? product.description
                    : "Tap to view details."}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.15em] text-brand-green opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  View details →
                </span>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mt-4 font-serif text-2xl font-semibold text-slate-900">
              {query ? "No matching products" : "No products yet"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {query
                ? "Try a different search term."
                : "Check back soon for new pieces."}
            </p>
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-5 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                Clear search
              </button>
            ) : null}
          </div>
        )}
      </section>

      {/* Powered by */}
      <p className="mx-auto mt-10 w-full max-w-6xl text-center text-xs text-slate-400">
        Powered by{" "}
        <Link
          href="/"
          className="font-semibold text-slate-500 transition hover:text-slate-900"
        >
          Retail Omega
        </Link>
      </p>

      {/* Product detail modal */}
      {selected ? (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selected.name}
            className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-green">
                  Product
                </p>
                <h3 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-slate-900">
                  {selected.name}
                </h3>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close product details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              {selected.image_url ? (
                <img
                  src={selected.image_url}
                  alt={selected.name}
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center text-slate-300">
                  <ShoppingBag className="h-12 w-12" aria-hidden="true" />
                </div>
              )}
            </div>

            {catalog.show_catalog_price ? (
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                  Price
                </span>
                <span className="text-2xl font-extrabold text-slate-900">
                  {money(selected.selling_price)}
                </span>
              </div>
            ) : null}

            {catalog.show_catalog_description && selected.description?.trim() ? (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                  Description
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {selected.description}
                </p>
              </div>
            ) : null}

            {catalog.phone_number ? (
              <a
                href={`tel:${catalog.phone_number}`}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Contact to order
              </a>
            ) : (
              <p className="mt-6 text-center text-sm text-slate-500">
                Contact the business to place an order.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
