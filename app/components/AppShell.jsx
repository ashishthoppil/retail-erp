"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getSupabaseBrowser } from "../lib/supabase-browser";
import {
  ChartNoAxesCombinedIcon,
  HandCoinsIcon,
  Home,
  LogOutIcon,
  MenuIcon,
  Package,
  Settings,
  ShoppingBasketIcon,
  X,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/add-stock", label: "Inventory", icon: ShoppingBasketIcon },
  { href: "/place-order", label: "Orders", icon: Package },
  { href: "/reports", label: "Reports", icon: ChartNoAxesCombinedIcon },
  { href: "/expenses", label: "Expenses", icon: HandCoinsIcon },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppShell({ title, subtitle, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleCloseNav = () => setIsNavOpen(false);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast("Logged out.");
    router.push("/auth");
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-10 sm:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
        <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:gap-3 lg:rounded-3xl lg:border lg:border-black/10 lg:bg-white/80 lg:p-6 lg:shadow-[var(--shadow)] lg:backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--sage)]">
            Menu
          </p>
          <nav className="mt-2 flex flex-col gap-2 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex gap-1 items-center rounded-2xl border px-4 py-2 text-black transition ${
                    isActive
                      ? "border-transparent bg-[color:var(--clay)]"
                      : "border-black/10 bg-white hover:border-transparent hover:bg-[color:var(--clay)]"
                  }`}
                >
                  <Icon className="h-4" />
                  {link.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="flex gap-1 items-center mt-2 rounded-2xl border border-black/10 bg-white px-4 py-2 text-left text-sm font-medium text-black/70 transition hover:border-transparent hover:cursor-pointer hover:bg-[color:var(--clay)]"
            >
              <LogOutIcon className="h-4" />
              Logout
            </button>
          </nav>
        </aside>

        <div className="flex-1">
          <header className="flex flex-col gap-4 sm:gap-6">
        <div className="flex items-center justify-between rounded-[24px] border border-black/10 bg-white/90 px-4 py-4 shadow-[var(--shadow)] backdrop-blur sm:hidden">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[color:var(--sage)]">
              Retail Omega
            </p>
            <h1 className="font-serif text-2xl text-[color:var(--ink)]">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsNavOpen(true)}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.25em] text-black"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        <div className="hidden flex-col gap-4 rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[var(--shadow)] backdrop-blur sm:flex sm:flex-row sm:items-center sm:justify-between lg:justify-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--sage)]">
              Retail Omega
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
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-black/70 transition hover:border-transparent hover:bg-[color:var(--clay)]"
            >
              Logout
            </button>
          </div>
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
                    Retail Omega
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseNav}
                  className="rounded-full border border-black/10 bg-white px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-black"
                >
                  <X />
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
                      {/* <span className="text-xs uppercase tracking-[0.25em] text-black/45">
                        Go
                      </span> */}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 flex items-center justify-between rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm text-black/80"
            >
              <span className="text-sm font-medium">Logout</span>
              <span className="text-xs uppercase tracking-[0.25em] text-black/45">
                Exit
              </span>
            </button>
          </nav>
        </aside>
      </div>

          <main className="mt-6 sm:mt-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
