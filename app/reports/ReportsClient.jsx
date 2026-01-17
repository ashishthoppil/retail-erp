"use client";

import { useEffect, useState } from "react";

const emptyReport = {
  weekly: 0,
  monthly: 0,
  yearly: 0,
};

export default function ReportsClient() {
  const [report, setReport] = useState(emptyReport);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadReports() {
      const [reportResponse, ordersResponse] = await Promise.all([
        fetch("/api/reports"),
        fetch("/api/orders"),
      ]);

      const reportJson = await reportResponse.json();
      const ordersJson = await ordersResponse.json();

      if (!reportResponse.ok) {
        setStatus(reportJson.error || "Unable to load reports.");
      } else {
        setReport(reportJson.data || emptyReport);
      }

      if (!ordersResponse.ok) {
        setStatus(ordersJson.error || "Unable to load orders.");
      } else {
        setOrders(ordersJson.data || []);
      }
    }
    loadReports();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value || 0);

  const totals = orders.reduce(
    (acc, order) => {
      const quantity = Number(order.quantity || 0);
      const sellingPrice = Number(order.selling_price || 0);
      const shippingCharge = Number(order.shipping_charge || 0);
      const buyingPrice = Number(order.products?.buying_price || 0);

      acc.revenue += quantity * sellingPrice + shippingCharge;
      acc.wholesale += quantity * buyingPrice;
      return acc;
    },
    { revenue: 0, wholesale: 0 }
  );

  const profit = totals.revenue - totals.wholesale;

  return (
    <div className="space-y-6">
      {status ? (
        <div className="rounded-2xl bg-[color:var(--clay)] px-4 py-3 text-sm text-black/70">
          {status}
        </div>
      ) : null}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            label: "Weekly revenue",
            value: report.weekly,
            note: "Last 7 days",
          },
          {
            label: "Monthly revenue",
            value: report.monthly,
            note: "Since month start",
          },
          {
            label: "Yearly revenue",
            value: report.yearly,
            note: "Since Jan 1",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[28px] border border-black/10 bg-white/85 p-6 shadow-sm"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-black/50">
              {item.label}
            </p>
            <h2 className="mt-4 font-serif text-3xl text-[color:var(--ink)]">
              {formatCurrency(item.value)}
            </h2>
            <p className="mt-2 text-sm text-black/55">{item.note}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[
          {
            label: "Total wholesale sold",
            value: totals.wholesale,
            note: "All time",
          },
          {
            label: "Profit from sales",
            value: profit,
            note: "All time",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[28px] border border-black/10 bg-white/85 p-6 shadow-sm"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-black/50">
              {item.label}
            </p>
            <h2 className="mt-4 font-serif text-3xl text-[color:var(--ink)]">
              {formatCurrency(item.value)}
            </h2>
            <p className="mt-2 text-sm text-black/55">{item.note}</p>
          </div>
        ))}
      </div>
      <section className="rounded-[28px] border border-black/10 bg-white/85 p-6 shadow-sm">
        <div>
          <h2 className="font-serif text-2xl text-[color:var(--ink)]">
            Order history
          </h2>
          <p className="mt-1 text-sm text-black/60">
            All recorded orders with totals.
          </p>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.2em] text-black/45">
                <th className="py-3">Date</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {orders.map((order) => {
                const total =
                  order.quantity * order.selling_price + order.shipping_charge;
                return (
                  <tr key={order.id} className="text-black/70">
                    <td className="py-3">
                      {new Date(order.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td>{order.products?.name || "Unknown"}</td>
                    <td>{order.quantity}</td>
                    <td>{formatCurrency(total)}</td>
                  </tr>
                );
              })}
              {!orders.length ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-sm text-black/50"
                  >
                    No orders yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
