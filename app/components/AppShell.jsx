"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/add-stock", label: "Add Stock" },
  { href: "/place-order", label: "Place Order" },
  { href: "/reports", label: "View Reports" },
  { href: "/expenses", label: "Add Expenses" },
];

export default function AppShell({ title, subtitle, children }) {
  const pathname = usePathname();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleCloseNav = () => setIsNavOpen(false);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-10 sm:py-10">
      <header className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-6">
        <div className="flex items-center justify-between rounded-[24px] border border-black/10 bg-white/90 px-4 py-4 shadow-[var(--shadow)] backdrop-blur sm:hidden">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[color:var(--sage)]">
              CasaStock
            </p>
            <h1 className="font-serif text-2xl text-[color:var(--ink)]">
              {title}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setIsNavOpen(true)}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.25em] text-black"
          >
            Menu
          </button>
        </div>

        <div className="hidden flex-col gap-4 rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[var(--shadow)] backdrop-blur sm:flex sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--sage)]">
              CasaStock
            </p>
            <h1 className="font-serif text-3xl text-[color:var(--ink)] sm:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 max-w-xl text-sm text-black/60 sm:text-base">
                {subtitle}
              </p>
            ) : null}
          </div>
          <nav className="flex flex-wrap gap-3 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full border px-4 py-2 text-black transition ${
                    isActive
                      ? "border-transparent bg-[color:var(--clay)]"
                      : "border-black/10 bg-white hover:border-transparent hover:bg-[color:var(--clay)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 sm:hidden ${
          isNavOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isNavOpen}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            isNavOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleCloseNav}
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-[78%] max-w-xs flex-col gap-6 bg-[color:var(--cream)] px-5 py-6 shadow-[var(--shadow)] transition-transform ${
            isNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[color:var(--sage)]">
                CasaStock
              </p>
              <p className="font-serif text-xl text-[color:var(--ink)]">
                Navigation
              </p>
            </div>
            <button
              type="button"
              onClick={handleCloseNav}
              className="rounded-full border border-black/10 bg-white px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-black"
            >
              Close
            </button>
          </div>
          {subtitle ? (
            <p className="text-sm text-black/60">{subtitle}</p>
          ) : null}
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleCloseNav}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${
                    isActive
                      ? "border-transparent bg-[color:var(--clay)] text-black"
                      : "border-black/10 bg-white/80 text-black/80"
                  }`}
                >
                  <span className="text-sm font-medium">{link.label}</span>
                  <span className="text-xs uppercase tracking-[0.25em] text-black/45">
                    Go
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>

      <main className="mx-auto mt-6 w-full max-w-6xl sm:mt-10">
        {children}
      </main>
    </div>
  );
}
