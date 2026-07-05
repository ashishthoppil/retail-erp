import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import StoreBadges from "../StoreBadges";

const PRODUCT_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

// PLACEHOLDER links — point these at real pages/profiles when they exist.
const LEGAL_LINKS = [
  { href: "#", label: "Privacy policy" },
  { href: "#", label: "Terms of service" },
];

const SOCIALS = [
  { href: "#", label: "Instagram", icon: Instagram },
  { href: "#", label: "Facebook", icon: Facebook },
];

const SUPPORT_EMAIL = "support@retailomega.app"; // PLACEHOLDER email

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/60">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/logo.png"
                alt=""
                width={32}
                height={32}
                className="rounded-lg ring-1 ring-black/5"
              />
              <span className="font-extrabold tracking-tight text-slate-900">
                Retail Omega
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Simple, real-time inventory management for small businesses —
              right from your phone.
            </p>
            <div className="mt-6">
              <StoreBadges />
            </div>
          </div>

          <nav aria-label="Product">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Product
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition hover:text-slate-900">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Support">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Support
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="transition hover:text-slate-900"
                >
                  {SUPPORT_EMAIL}
                </a>
              </li>
              <li>
                <a href="#faq" className="transition hover:text-slate-900">
                  Help &amp; FAQ
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Legal
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition hover:text-slate-900">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Retail Omega. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
