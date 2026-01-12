import Link from "next/link";

const navLinks = [
  { href: "/add-stock", label: "Add Stock" },
  { href: "/place-order", label: "Place Order" },
  { href: "/reports", label: "View Reports" },
];

export default function AppShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen px-6 py-10 sm:px-10">
      <header className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[var(--shadow)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-black transition hover:border-transparent hover:bg-[color:var(--clay)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto mt-10 w-full max-w-6xl">{children}</main>
    </div>
  );
}
