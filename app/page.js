import Link from "next/link";
import AppShell from "./components/AppShell";
import CapitalCard from "./components/CapitalCard";
import StockReminder from "./components/StockReminder";

export default function Home() {
  return (
    <AppShell
      title=""
      subtitle=""
    >
      <section className="space-y-6">
        <CapitalCard />
        <StockReminder />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Add Stock",
              description:
                "Capture batches, product images, prices, and quantities.",
              href: "/add-stock",
            },
            {
              title: "Place Order",
              description: "Update inventory immediately when items sell.",
              href: "/place-order",
            },
            {
              title: "View Reports",
              description: "Weekly, monthly, and yearly revenue at a glance.",
              href: "/reports",
            },
            {
              title: "Add Expense",
              description: "Log outgoing costs and adjust capital.",
              href: "/expenses",
            },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group flex flex-col justify-between rounded-[28px] border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-transparent hover:bg-[color:var(--clay)]"
            >
              <div>
                <h3 className="font-serif text-2xl text-[color:var(--ink)]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-black/60">{card.description}</p>
              </div>
              <span className="mt-6 inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-black/70">
                Open
              </span>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
