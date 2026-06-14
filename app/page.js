import {
  BarChart3,
  BellRing,
  Boxes,
  CheckIcon,
  ReceiptText,
  Sparkles,
} from "lucide-react";
import StoreBadges from "./components/StoreBadges";

const featureSections = [
  {
    eyebrow: "Inventory",
    title: "Live stock view",
    description: "Track your business inventory in real-time.",
    image: "/images/live-stock.png",
    points: [
      {
        title: "Real-time updates",
        description:
          "Always know what's available and what needs to be restocked.",
      },
      {
        title: "Smart alerts",
        description:
          "Get notified when stock is low or out, so you never miss a reorder.",
      },
      {
        title: "Easy management",
        description: "Easily manage batches and categories of products.",
      },
    ],
  },
  {
    eyebrow: "Orders",
    title: "Capture orders with ease",
    description: "Log customer orders quickly and efficiently.",
    image: "/images/orders.png",
    reverse: true,
    points: [
      {
        title: "Quick entry",
        description: "Add items to orders in seconds.",
      },
      {
        title: "Multiple items",
        description: "Handle orders with multiple items seamlessly.",
      },
      {
        title: "Invoice generation",
        description: "Easily view and send invoices with ease.",
      },
    ],
  },
  {
    eyebrow: "Finance",
    title: "Track revenue and expenses",
    description: "Monitor your cash flow in one place.",
    image: "/images/reports.png",
    points: [
      {
        title: "Revenue insights",
        description: "Keep track of your sales and revenue growth.",
      },
      {
        title: "Expense tracking",
        description: "Monitor and categorize outgoing costs.",
      },
      {
        title: "Analyze profits",
        description: "Easily view profits and losses over time.",
      },
    ],
  },
];

const highlights = [
  {
    icon: Boxes,
    title: "Inventory",
    description: "Batches, categories and stock at a glance.",
  },
  {
    icon: ReceiptText,
    title: "Orders",
    description: "Capture sales and generate invoices.",
  },
  {
    icon: BarChart3,
    title: "Reports",
    description: "Revenue, expenses and profit insights.",
  },
  {
    icon: BellRing,
    title: "Alerts",
    description: "Low-stock reminders so you never run out.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-10 sm:py-10">
      <div className="mx-auto w-full max-w-6xl space-y-6 sm:space-y-8">
        {/* Nav */}
        <header className="flex w-full items-center justify-between rounded-full border border-black/10 bg-white/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--ink)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--ink)] text-[10px] font-bold tracking-normal text-white">
              RO
            </span>
            Retail Omega
          </div>
          <a
            href="#download"
            className="hidden rounded-full bg-[color:var(--ink)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90 sm:inline-flex"
          >
            Download
          </a>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[36px] border border-black/10 bg-white/90">
          <div className="grid gap-6 lg:grid-cols-[0.58fr_0.42fr]">
            <div className="relative z-10 p-8 sm:p-10 lg:pr-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[color:var(--cream)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--copper)]">
                <Sparkles className="h-3.5 w-3.5" />
                Now on mobile
              </span>
              <h1 className="mt-5 font-serif text-4xl leading-[1.05] text-[color:var(--ink)] sm:text-5xl lg:text-6xl">
                Your shop's inventory, in your pocket.
              </h1>
              <p className="mt-5 max-w-md text-base text-black/60 sm:text-lg">
                Track stock, capture orders, and watch revenue grow — all from a
                calm, beautifully simple app built for small businesses.
              </p>

              <div className="mt-8">
                <StoreBadges />
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-black/40">
                  Free to download · Available on iOS & Android
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {highlights.map((item) => (
                  <span
                    key={item.title}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-black/60"
                  >
                    <item.icon className="h-3.5 w-3.5 text-[color:var(--sage)]" />
                    {item.title}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative min-h-[320px] lg:min-h-[460px]">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[color:var(--clay)]/40 to-transparent" />
              <img
                src="/images/hero.png"
                alt="Retail Omega app"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Highlights strip */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] border border-black/10 bg-white/90 p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--cream)] text-[color:var(--copper)]">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 font-semibold text-[color:var(--ink)]">
                {item.title}
              </p>
              <p className="mt-1 text-sm text-black/55">{item.description}</p>
            </div>
          ))}
        </section>

        {/* Feature sections */}
        {featureSections.map((section) => (
          <section
            key={section.title}
            className="grid gap-8 rounded-[32px] border border-black/10 bg-white/90 p-8 lg:grid-cols-2 lg:items-center"
          >
            <div className={section.reverse ? "lg:order-2" : ""}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--sage)]">
                {section.eyebrow}
              </p>
              <h2 className="mt-3 font-serif text-3xl text-[color:var(--ink)] sm:text-4xl">
                {section.title}
              </h2>
              <p className="mt-2 text-sm text-black/60">
                {section.description}
              </p>
              <div className="mt-6 space-y-4 text-sm text-black/65">
                {section.points.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--cream)] text-[color:var(--copper)]">
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[color:var(--ink)]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-black/60">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={`flex items-center justify-center ${
                section.reverse ? "lg:order-1" : ""
              }`}
            >
              <img
                src={section.image}
                alt={`${section.title} preview`}
                className="w-full max-w-lg rounded-[28px] border border-black/10 bg-white object-cover shadow-sm"
              />
            </div>
          </section>
        ))}

        {/* Download CTA */}
        <section
          id="download"
          className="relative overflow-hidden rounded-[36px] border border-black/10 bg-[color:var(--ink)] p-10 text-center sm:p-14"
        >
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[color:var(--copper)]/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-[color:var(--sage)]/30 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Get the app
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl text-white sm:text-5xl">
              Run your business from anywhere.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/70 sm:text-base">
              Download Retail Omega and bring calm, organized inventory
              management to your pocket today.
            </p>
            <div className="mt-8 flex justify-center">
              <StoreBadges align="center" />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-4 rounded-[24px] border border-black/10 bg-white/80 px-6 py-5 text-sm text-black/55 sm:flex-row">
          <div className="flex items-center gap-2 font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--ink)] text-[9px] font-bold tracking-normal text-white">
              RO
            </span>
            Retail Omega
          </div>
          <p>© {new Date().getFullYear()} Retail Omega. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
