import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          <Image
            src="/images/logo.png"
            alt=""
            width={36}
            height={36}
            className="rounded-xl shadow-sm ring-1 ring-black/5"
          />
          <span className="text-base font-extrabold tracking-tight text-slate-900">
            Retail Omega
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded transition hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button href="#download">
          <span className="sm:hidden">Get the app</span>
          <span className="hidden sm:inline">Get it on Google Play</span>
        </Button>
      </div>
    </header>
  );
}
