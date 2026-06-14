import {
  ArrowRight,
  BarChart3,
  BellRing,
  Boxes,
  Check,
  ReceiptText,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import StoreBadges from "./components/StoreBadges";

const BRAND_GRADIENT = "bg-gradient-to-br from-[#16399c] via-[#1b73c0] to-[#36ab3b]";

const features = [
  {
    icon: Boxes,
    title: "Inventory",
    description:
      "Track batches, categories and live stock levels at a glance.",
  },
  {
    icon: ReceiptText,
    title: "Orders & invoices",
    description: "Capture customer orders in seconds and share invoices.",
  },
  {
    icon: BarChart3,
    title: "Reports",
    description: "See revenue, expenses and profit trends in real time.",
  },
  {
    icon: Wallet,
    title: "Expenses",
    description: "Log and categorise costs so cash flow stays clear.",
  },
  {
    icon: Share2,
    title: "Shareable catalogue",
    description: "A public link customers can browse and order from.",
  },
  {
    icon: BellRing,
    title: "Low-stock alerts",
    description: "Smart reminders so you never miss a reorder.",
  },
];

const showcase = [
  {
    eyebrow: "Inventory",
    title: "Your whole shop, always in sync",
    description:
      "Know exactly what's in stock, what's running low, and what needs restocking — updated the moment you make a sale.",
    image: "/images/live-stock.png",
    points: ["Real-time stock levels", "Batch & category management", "Low-stock alerts"],
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
    eyebrow: "Finance",
    title: "Revenue and expenses, crystal clear",
    description:
      "Watch your cash flow in one calm dashboard. Track income, categorise expenses, and see profit at a glance.",
    image: "/images/reports.png",
    points: ["Revenue insights", "Expense tracking", "Profit & loss over time"],
  },
];

const stats = [
  { icon: TrendingUp, label: "Real-time", sub: "inventory sync" },
  { icon: ShieldCheck, label: "Private", sub: "your data, secured" },
  { icon: Sparkles, label: "Free", sub: "to download" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[32rem] w-[32rem] rounded-full bg-green-500/15 blur-3xl" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/logo.png"
              alt="Retail Omega"
              className="h-9 w-9 rounded-xl shadow-sm ring-1 ring-black/5"
            />
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              Retail Omega
            </span>
          </div>
          <a
            href="#download"
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90 ${BRAND_GRADIENT}`}
          >
            Download
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-10 pt-12 sm:px-8 sm:pt-20 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Now on iOS &amp; Android
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Your shop's inventory,{" "}
            <span className="bg-gradient-to-r from-blue-700 to-green-500 bg-clip-text text-transparent">
              in your pocket.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
            Retail Omega helps small businesses track stock, capture orders, and
            grow revenue — all from one calm, beautifully simple app.
          </p>

          <div className="mt-8">
            <StoreBadges />
            <p className="mt-3 text-sm font-medium text-slate-400">
              Free to download · No card required
            </p>
          </div>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label}>
                <s.icon className="h-5 w-5 text-green-600" />
                <p className="mt-2 text-sm font-bold text-slate-900">{s.label}</p>
                <p className="text-xs text-slate-500">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            className={`relative aspect-square overflow-hidden rounded-[2.5rem] p-8 shadow-2xl ${BRAND_GRADIENT}`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
            <div className="flex h-full items-center justify-center">
              <img
                src="/images/logo.png"
                alt="Retail Omega app icon"
                className="w-3/5 drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Floating cards */}
          <div className="absolute -left-4 top-10 hidden rounded-2xl bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur sm:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Revenue today</p>
                <p className="text-lg font-extrabold text-slate-900">₹24,860</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 bottom-10 hidden rounded-2xl bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur sm:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Low stock</p>
                <p className="text-lg font-extrabold text-slate-900">3 items</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-600">
            Everything you need
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            One app to run the whole shop
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            From the first batch of stock to your monthly profit report — Retail
            Omega keeps it all in one place.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-transparent hover:shadow-xl"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md ${BRAND_GRADIENT}`}
              >
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section className="mx-auto max-w-6xl space-y-20 px-5 pb-20 sm:px-8 sm:pb-28">
        {showcase.map((s) => (
          <div
            key={s.title}
            className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
          >
            <div className={s.reverse ? "lg:order-2" : ""}>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-600">
                {s.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {s.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                {s.description}
              </p>
              <ul className="mt-6 space-y-3">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-slate-700">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="font-medium">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.reverse ? "lg:order-1" : ""}>
              <div className="relative">
                <div
                  className={`absolute -inset-4 -z-10 rounded-[2.5rem] opacity-20 blur-2xl ${BRAND_GRADIENT}`}
                />
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full rounded-3xl border border-slate-200 bg-white object-cover shadow-xl"
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Download CTA */}
      <section id="download" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div
          className={`relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center shadow-2xl sm:px-16 sm:py-20 ${BRAND_GRADIENT}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
          <div className="relative">
            <img
              src="/images/logo.png"
              alt="Retail Omega"
              className="mx-auto h-20 w-20 rounded-2xl shadow-lg ring-1 ring-white/20"
            />
            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Run your business from anywhere
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-white/80 sm:text-lg">
              Download Retail Omega today and bring calm, organised inventory
              management to your pocket.
            </p>
            <div className="mt-8 flex justify-center">
              <StoreBadges align="center" variant="light" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/logo.png"
              alt="Retail Omega"
              className="h-7 w-7 rounded-lg ring-1 ring-black/5"
            />
            <span className="font-bold text-slate-800">Retail Omega</span>
          </div>
          <p>© {new Date().getFullYear()} Retail Omega. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
