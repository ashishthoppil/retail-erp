import Link from "next/link";
import AppShell from "./components/AppShell";

export default function Home() {
  return (
    <AppShell
      title="Inventory at a glance."
      subtitle="Track batches, add new decor items, and place orders for your home studio without the fuss."
    >
      <section className="grid gap-4 md:grid-cols-3">
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
      </section>
    </AppShell>
  );
}
