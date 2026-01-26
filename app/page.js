import { CheckIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen sm:px-10">
      <div className="mx-auto w-full max-w-6xl space-y-8 rounded-[36px]   p-6 sm:p-8">
        <header className="flex w-full items-center justify-between rounded-[22px] border border-black/10 bg-white/85 px-6 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--sage)]">
            Retail Omega
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black/70"
            >
              Login
            </Link>
            <Link
              href="/auth"
              className="rounded-full bg-[color:var(--ink)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
            >
              Register
            </Link>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white/90">
          <div className="grid gap-6 lg:grid-cols-[0.6fr_0.4fr]">
            <div className="relative z-10 p-8 lg:p-10 lg:pr-0">
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--copper)]">
                Retail Omega
              </p>
              <h1 className="mt-4 font-serif text-4xl text-[color:var(--ink)] sm:text-5xl">
                Run your small business inventory with clarity.
              </h1>
              <p className="mt-4 text-base text-black/60">
                Track batches, capture orders, and see revenue instantly. Built
                for small studios that want a calm, organized workflow.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/auth"
                  className="rounded-full bg-[color:var(--ink)] px-5 py-3 text-sm font-semibold text-white shadow-md"
                >
                  Get started
                </Link>
                <Link
                  href="/plan"
                  className="rounded-full border border-black/20 px-5 py-3 text-sm font-semibold text-black"
                >
                  View plans
                </Link>
              </div>
            </div>
            <div className="relative min-h-[360px]">
              <img
                src="/images/hero.png"
                alt="Retail Omega hero"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] rounded-[32px] border border-black/10 bg-white/90 p-8">
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-3xl text-[color:var(--ink)]">
                Live stock view
              </h2>
              <p className="mt-2 text-sm text-black/60">
                Track your business inventory in real-time.
              </p>
            </div>
            <div className="space-y-4 text-sm text-black/65">
              {[
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
                  description:
                    "Easily manage batches and categories of products.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-xs font-semibold text-black/60">
                    <CheckIcon />
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
          <div className="flex items-center justify-center">
            <img
              src="/images/live-stock.png"
              alt="Live stock preview"
              className="w-full max-w-lg rounded-[28px] border border-black/10 bg-white object-cover shadow-sm"
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] border border-black/10 bg-white/90 p-8">
            <h2 className="font-serif text-3xl text-[color:var(--ink)]">
              Capture orders with ease
            </h2>
            <p className="mt-2 text-sm text-black/60">
              Log customer orders quickly and efficiently.
            </p>
            <div className="mt-6">
              <img
                src="/images/orders.png"
                alt="Orders preview"
                className="w-full rounded-[24px] border border-black/10 bg-white object-cover shadow-sm"
              />
            </div>
            <div className="mt-6 space-y-4 text-sm text-black/65">
              {[
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
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-xs font-semibold text-black/60">
                    <CheckIcon />
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

          <div className="rounded-[32px] border border-black/10 bg-white/90 p-8">
            <h2 className="font-serif text-3xl text-[color:var(--ink)]">
              Track revenue and expenses
            </h2>
            <p className="mt-2 text-sm text-black/60">
              Monitor your cash flow in one place.
            </p>
            <div className="mt-6">
              <img
                src="/images/reports.png"
                alt="Reports preview"
                className="w-full rounded-[24px] border border-black/10 bg-white object-cover shadow-sm"
              />
            </div>
            <div className="mt-6 space-y-4 text-sm text-black/65">
              {[
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
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-xs font-semibold text-black/60">
                    <CheckIcon />
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
        </section>
      </div>
    </div>
  );
}
