import Image from "next/image";
import {
  Barcode,
  BarChart3,
  BellRing,
  Boxes,
  Check,
  Download,
  PackagePlus,
  Smartphone,
  Star,
  Warehouse,
} from "lucide-react";
import StoreBadges from "./components/StoreBadges";
import Button from "./components/marketing/Button";
import Card from "./components/marketing/Card";
import Container from "./components/marketing/Container";
import Footer from "./components/marketing/Footer";
import Nav from "./components/marketing/Nav";
import Section, { SectionHeading } from "./components/marketing/Section";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: Boxes,
    title: "Know what's in stock without walking the aisles",
    description:
      "Live stock levels update the moment you sell or restock, so the answer to \"do we have it?\" is always in your pocket.",
  },
  {
    icon: BellRing,
    title: "Stop losing sales to empty shelves",
    description:
      "Low-stock alerts nudge you before a bestseller runs out — reorder on time, every time.",
  },
  {
    icon: Barcode,
    title: "Add a product in seconds, not minutes",
    description:
      "Snap a photo, set a price, scan a barcode — your catalogue stays tidy without the spreadsheet wrestling.",
  },
  {
    icon: Warehouse,
    title: "Every shelf, stall and storeroom in one place",
    description:
      "Track batches and categories across locations so nothing gets lost in the back room.",
  },
  {
    icon: BarChart3,
    title: "See where the money actually goes",
    description:
      "Simple sales, expense and stock reports show profit at a glance — no accountant required.",
  },
  {
    icon: Smartphone,
    title: "Run the shop from anywhere",
    description:
      "At the market, at the supplier, on the sofa — your whole inventory travels with you.",
  },
];

const steps = [
  {
    icon: Download,
    title: "Download the app",
    description:
      "Get Retail Omega free on Google Play and set up your shop in a couple of minutes.",
  },
  {
    icon: PackagePlus,
    title: "Add your products",
    description:
      "Name, photo, price, stock count — or scan a barcode. Organise with batches and categories.",
  },
  {
    icon: BellRing,
    title: "Track stock, relax",
    description:
      "Stock updates live as you sell, and low-stock alerts tell you exactly when to reorder.",
  },
];

const showcase = [
  {
    eyebrow: "Inventory",
    title: "Your whole shop, always in sync",
    description:
      "Know exactly what's in stock, what's running low, and what needs restocking — updated the moment you make a sale.",
    image: "/images/live-stock.png",
    points: [
      "Real-time stock levels",
      "Batch & category management",
      "Low-stock alerts",
    ],
  },
  {
    eyebrow: "Orders",
    title: "Capture every sale in seconds",
    description:
      "Add multiple items, generate clean invoices, and keep a tidy record of every order — right from your phone.",
    image: "/images/orders.png",
    reverse: true,
    points: ["Quick multi-item entry", "Instant invoices", "Full order history"],
  },
  {
    eyebrow: "Reports",
    title: "Revenue and expenses, crystal clear",
    description:
      "Watch your cash flow in one calm dashboard. Track income, categorise expenses, and see profit at a glance.",
    image: "/images/reports.png",
    points: ["Revenue insights", "Expense tracking", "Profit & loss over time"],
  },
];

// PLACEHOLDER pricing copy — the ₹89 plan matches the live in-app plan;
// verify the free-tier framing (trial terms) before launch.
const pricing = [
  {
    name: "Free to start",
    price: "₹0",
    period: "",
    description: "Download the app and set up your shop — no card required.",
    features: [
      "Free download on Google Play",
      "Set up your shop profile",
      "Explore the app before you commit",
    ],
    cta: { label: "Download free", href: "#download", variant: "secondary" },
  },
  {
    name: "Retail Omega Monthly",
    price: "₹89",
    period: "/month",
    description: "Everything you need to run the whole shop, cancel anytime.",
    highlighted: true,
    features: [
      "Track batches, products, and live stock",
      "Multi-item orders with address capture",
      "Revenue + expense reports",
      "Capital tracking and low-stock alerts",
      "Shareable public catalogue for customers",
    ],
    cta: { label: "Get started on Google Play", href: "#download" },
  },
];

// PLACEHOLDER testimonials — replace with real customer quotes.
const testimonials = [
  {
    quote:
      "I used to count shelves every evening. Now I check my phone on the bus home and already know what to reorder.",
    name: "Anita R.",
    role: "Boutique owner",
  },
  {
    quote:
      "The low-stock alert saved my weekend sale — twice. It paid for itself in the first month.",
    name: "Joseph M.",
    role: "Grocery store owner",
  },
  {
    quote:
      "Adding products is so fast that my whole catalogue was in the app before lunch. My customers browse it online now.",
    name: "Priya S.",
    role: "Handicrafts seller",
  },
];

const faqs = [
  {
    q: "Is Retail Omega free?",
    a: "The app is free to download on Google Play, with no card required to try it. The full workspace — live stock tracking, orders, reports and alerts — is ₹89/month, and you can cancel anytime.",
  },
  {
    q: "Is Retail Omega available on iPhone?",
    a: "Not yet — Retail Omega is currently available on Android via Google Play. The iOS app is coming soon to the App Store.",
  },
  {
    // PLACEHOLDER answer — confirm actual offline behaviour before launch.
    q: "Does it work offline?",
    a: "Retail Omega syncs your inventory in real time, so an internet connection is needed to keep stock levels up to date across devices.",
  },
  {
    // PLACEHOLDER answer — confirm any product limits before launch.
    q: "How many products can I add?",
    a: "There's no practical limit for a small business — add your whole catalogue, organised with batches and categories.",
  },
  {
    q: "Can my customers see my products?",
    a: "Yes. Retail Omega gives you a shareable public catalogue link that customers can browse and use to contact you with orders.",
  },
  {
    q: "Is my data safe?",
    a: "Your data belongs to you. It's stored securely in the cloud, tied to your private account, and never shared with other businesses.",
  },
];

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function Stars() {
  return (
    <span className="flex items-center gap-0.5 text-amber-400" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
    </span>
  );
}

/* PLACEHOLDER phone mockup — a hand-built preview of the app's stock screen.
   Swap the inner screen for a real portrait app screenshot when available. */
function PhoneMockup() {
  const rows = [
    { name: "Cotton kurta", count: "24 in stock", tone: "bg-brand-green" },
    { name: "Ceramic mugs", count: "6 left", tone: "bg-amber-400" },
    { name: "Gift boxes", count: "2 left — reorder", tone: "bg-red-500" },
    { name: "Jute bags", count: "48 in stock", tone: "bg-brand-green" },
  ];
  return (
    <div className="relative mx-auto w-[280px] rounded-[2.75rem] border-[10px] border-slate-900 bg-slate-900 shadow-2xl">
      <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
      <div className="overflow-hidden rounded-[2.1rem] bg-slate-50">
        <div className="flex items-center gap-2 bg-white px-5 pb-3 pt-9">
          <Image
            src="/images/logo.png"
            alt=""
            width={28}
            height={28}
            className="rounded-lg"
          />
          <div>
            <p className="text-[10px] text-slate-400">Good morning</p>
            <p className="text-xs font-bold text-slate-900">Ashish's Store</p>
          </div>
        </div>
        <div className="space-y-3 px-4 py-4">
          <div className="rounded-2xl bg-brand-gradient p-4 text-white">
            <p className="text-[10px] uppercase tracking-wide text-white/70">
              Revenue today
            </p>
            <p className="mt-1 text-2xl font-extrabold">₹24,860</p>
          </div>
          <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Stock levels
          </p>
          {rows.map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className={`h-2 w-2 rounded-full ${row.tone}`} />
                <span className="text-xs font-semibold text-slate-800">
                  {row.name}
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500">
                {row.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-white text-slate-900">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[32rem] w-[32rem] rounded-full bg-green-500/10 blur-3xl" />
      </div>

      <Nav />

      <main>
        {/* Hero */}
        <Container className="grid items-center gap-12 pb-14 pt-12 sm:pt-20 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green" />
              </span>
              Built for small businesses
            </span>

            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Never lose a sale to{" "}
              <span className="bg-gradient-to-r from-brand-navy via-brand-blue to-brand-green bg-clip-text text-transparent">
                &ldquo;out of stock&rdquo;
              </span>{" "}
              again.
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              Retail Omega gives shop owners live stock levels, low-stock
              alerts and dead-simple product management — all from the phone
              already in your pocket.
            </p>

            <div className="mt-8">
              <StoreBadges />
              <p className="mt-3 text-sm font-medium text-slate-400">
                Free to download · No card required
              </p>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-md">
            <div
              className="absolute -inset-8 -z-10 rounded-full bg-brand-gradient opacity-15 blur-3xl"
              aria-hidden="true"
            />
            <PhoneMockup />

            {/* Floating stat cards */}
            <div className="absolute -left-6 top-16 hidden rounded-2xl bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <BellRing className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Low stock alert</p>
                  <p className="text-sm font-extrabold text-slate-900">
                    Gift boxes — 2 left
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -right-6 bottom-16 hidden rounded-2xl bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-brand-green">
                  <Boxes className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Stock synced</p>
                  <p className="text-sm font-extrabold text-slate-900">
                    Just now
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Social proof strip — PLACEHOLDER numbers & shop names */}
        <div className="border-y border-slate-200 bg-slate-50/60">
          <Container className="flex flex-col items-center gap-6 py-8 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2.5">
              <Stars />
              <p className="text-sm font-semibold text-slate-700">
                4.8 rating on Google Play
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-700">
              1,000+ small businesses on board
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-2.5">
              {["Bloom Boutique", "Corner Mart", "Verma Traders"].map((shop) => (
                <li
                  key={shop}
                  className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500"
                >
                  {shop}
                </li>
              ))}
            </ul>
          </Container>
        </div>

        {/* Features */}
        <Section id="features">
          <Container>
            <SectionHeading
              eyebrow="Why shop owners love it"
              title="Less time counting stock, more time selling"
              sub="Retail Omega tackles the daily headaches of running a small shop — no enterprise software, no training manuals."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="group p-7 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-md">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* How it works */}
        <Section id="how-it-works" className="bg-slate-50/60">
          <Container>
            <SectionHeading
              eyebrow="How it works"
              title="Up and running before your chai goes cold"
              sub="Three steps from download to a shop that runs itself."
            />
            <ol className="mt-12 grid gap-5 sm:grid-cols-3">
              {steps.map((step, index) => (
                <Card as="li" key={step.title} className="relative p-7">
                  <span className="absolute right-6 top-5 font-serif text-5xl font-semibold text-slate-100">
                    {index + 1}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-brand-green">
                    <step.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </Card>
              ))}
            </ol>
          </Container>
        </Section>

        {/* Product showcase */}
        <Section>
          <Container className="space-y-20">
            {showcase.map((item) => (
              <div
                key={item.title}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div className={item.reverse ? "lg:order-2" : ""}>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-green">
                    {item.eyebrow}
                  </p>
                  <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-3 text-slate-700"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-brand-green">
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="font-medium">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={item.reverse ? "lg:order-1" : ""}>
                  <div className="relative">
                    <div
                      className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-brand-gradient opacity-20 blur-2xl"
                      aria-hidden="true"
                    />
                    <Image
                      src={item.image}
                      alt={`Retail Omega app — ${item.title.toLowerCase()}`}
                      width={1536}
                      height={1024}
                      className="w-full rounded-3xl border border-slate-200 bg-white object-cover shadow-xl"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Container>
        </Section>

        {/* Pricing */}
        <Section id="pricing" className="bg-slate-50/60">
          <Container>
            <SectionHeading
              eyebrow="Pricing"
              title="Small-business friendly, honestly priced"
              sub="Start free, upgrade when you're ready. No contracts, cancel anytime."
            />
            <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
              {pricing.map((plan) => (
                <Card
                  key={plan.name}
                  className={`flex flex-col p-8 ${
                    plan.highlighted
                      ? "relative border-transparent shadow-xl ring-2 ring-brand-green"
                      : ""
                  }`}
                >
                  {plan.highlighted ? (
                    <span className="absolute -top-3.5 left-8 rounded-full bg-brand-green px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                      Most popular
                    </span>
                  ) : null}
                  <h3 className="text-lg font-bold text-slate-900">
                    {plan.name}
                  </h3>
                  <p className="mt-3 flex items-baseline gap-1">
                    <span className="font-serif text-5xl font-semibold tracking-tight text-slate-900">
                      {plan.price}
                    </span>
                    {plan.period ? (
                      <span className="text-sm font-medium text-slate-500">
                        {plan.period}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    {plan.description}
                  </p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-slate-700"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 text-brand-green">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    href={plan.cta.href}
                    variant={plan.cta.variant || "primary"}
                    size="lg"
                    className="mt-8 w-full"
                  >
                    {plan.cta.label}
                  </Button>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* Testimonials — PLACEHOLDER quotes */}
        <Section>
          <Container>
            <SectionHeading
              eyebrow="Testimonials"
              title="Shop owners, in their own words"
            />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card as="figure" key={t.name} className="flex flex-col p-7">
                  <Stars />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </figcaption>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* FAQ */}
        <Section id="faq" className="bg-slate-50/60">
          <Container className="max-w-3xl">
            <SectionHeading
              eyebrow="FAQ"
              title="Questions, answered"
            />
            <div className="mt-10 space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm open:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-slate-900 [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span
                      className="text-slate-400 transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </Container>
        </Section>

        {/* Final CTA */}
        <Section id="download">
          <Container>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-gradient px-6 py-16 text-center shadow-2xl sm:px-16 sm:py-20">
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_50%)]"
                aria-hidden="true"
              />
              <div className="relative">
                <Image
                  src="/images/logo.png"
                  alt="Retail Omega logo"
                  width={80}
                  height={80}
                  className="mx-auto rounded-2xl shadow-lg ring-1 ring-white/20"
                />
                <h2 className="mx-auto mt-6 max-w-2xl font-serif text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  Put your shop in your pocket today
                </h2>
                <p className="mx-auto mt-4 max-w-md text-base text-white/80 sm:text-lg">
                  Join small business owners who stopped guessing their stock
                  and started tracking it.
                </p>
                <div className="mt-8 flex justify-center">
                  <StoreBadges align="center" variant="light" />
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
