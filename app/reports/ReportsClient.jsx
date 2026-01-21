"use client";

import { useEffect, useMemo, useState } from "react";

const emptyReport = {
  weekly: 0,
  monthly: 0,
  yearly: 0,
};

const PAGE_SIZE = 10;

const toMonthInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export default function ReportsClient() {
  const [report, setReport] = useState(emptyReport);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() =>
    toMonthInputValue(new Date())
  );
  const [orderQuery, setOrderQuery] = useState("");
  const [orderPage, setOrderPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    async function loadReports() {
      const reportResponse = await fetch(
        `/api/reports?month=${encodeURIComponent(selectedMonth)}`
      );

      const reportJson = await reportResponse.json();

      if (!reportResponse.ok) {
        setStatus(reportJson.error || "Unable to load reports.");
      } else {
        setReport(reportJson.data || emptyReport);
      }
    }
    loadReports();
  }, [selectedMonth]);

  useEffect(() => {
    async function loadOrders() {
      setOrdersLoading(true);
      const ordersResponse = await fetch("/api/orders");
      const ordersJson = await ordersResponse.json();

      if (!ordersResponse.ok) {
        setStatus(ordersJson.error || "Unable to load orders.");
      } else {
        setOrders(ordersJson.data || []);
      }
      setOrdersLoading(false);
    }
    loadOrders();
  }, []);

  useEffect(() => {
    setOrderPage(1);
  }, [orderQuery]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value || 0);

  const totals = orders.reduce(
    (acc, order) => {
      const items = order.order_items || [];
      const itemsRevenue = items.reduce(
        (sum, item) => sum + item.quantity * item.selling_price,
        0
      );
      const itemsWholesale = items.reduce(
        (sum, item) =>
          sum + item.quantity * Number(item.products?.buying_price || 0),
        0
      );

      acc.revenue += itemsRevenue + Number(order.shipping_charge || 0);
      acc.wholesale += itemsWholesale;
      return acc;
    },
    { revenue: 0, wholesale: 0 }
  );

  const profit = totals.revenue - totals.wholesale;

  const filteredOrders = useMemo(() => {
    const query = orderQuery.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter((order) =>
      (order.order_items || []).some((item) =>
        item.products?.name?.toLowerCase().includes(query)
      )
    );
  }, [orders, orderQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  useEffect(() => {
    setOrderPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const pagedOrders = filteredOrders.slice(
    (orderPage - 1) * PAGE_SIZE,
    orderPage * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      {status ? (
        <div className="rounded-2xl bg-[color:var(--clay)] px-4 py-3 text-sm text-black/70">
          {status}
        </div>
      ) : null}
      <div className="flex gap-4 overflow-x-auto px-1 pb-1 sm:grid sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[
          {
            key: "weekly",
            label: "Weekly revenue",
            value: report.weekly,
            note: "Last 7 days",
          },
          {
            key: "monthly",
            label: "Monthly revenue",
            value: report.monthly,
            note: "This month",
          },
          {
            key: "yearly",
            label: "Yearly revenue",
            value: report.yearly,
            note: "Since Jan 1",
          },
          {
            key: "wholesale",
            label: "Total Bought",
            value: totals.wholesale,
            note: "All time",
          },
          {
            key: "profit",
            label: "Profit from sales",
            value: profit,
            note: "All time",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="min-w-[220px] snap-start rounded-[22px] border border-black/10 bg-white/90 p-4 shadow-sm sm:min-w-0 sm:rounded-[28px] sm:p-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-black/50">
              {item.label}
            </p>
            <h2 className="mt-3 font-serif text-2xl text-[color:var(--ink)] sm:mt-4 sm:text-2xl">
              {formatCurrency(item.value)}
            </h2>
            {item.key === "monthly" ? (
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-black/55 sm:text-sm">
                <span className="hidden sm:inline">{item.note}</span>
                {/* <input
                  type="month"
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  className="w-full rounded-full border border-black/10 bg-white/80 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-black/60 sm:w-auto sm:py-1 sm:text-xs"
                /> */}
              </div>
            ) : (
              <p className="mt-2 text-xs text-black/55 sm:text-sm">
                {item.note}
              </p>
            )}
          </div>
        ))}
      </div>
      <section className="rounded-[24px] border border-black/10 bg-white/90 p-5 shadow-sm sm:rounded-[28px] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl text-[color:var(--ink)]">
            Order history
          </h2>
          <input
            value={orderQuery}
            onChange={(event) => setOrderQuery(event.target.value)}
            placeholder="Search by item name"
            className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/70 focus:border-[color:var(--sage)] focus:outline-none sm:w-64"
          />
        </div>
        <div className="mt-6 space-y-3 sm:hidden">
          {ordersLoading ? (
            <div className="rounded-2xl border border-dashed border-black/10 px-4 py-6 text-center text-sm text-black/50">
              Loading orders...
            </div>
          ) : null}
          {pagedOrders.map((order) => {
            const items = order.order_items || [];
            const itemsTotal = items.reduce(
              (sum, item) => sum + item.quantity * item.selling_price,
              0
            );
            const total = itemsTotal + Number(order.shipping_charge || 0);
            const itemLabel =
              items.length > 1
                ? `${items[0]?.products?.name || "Order"} +${
                    items.length - 1
                  }`
                : items[0]?.products?.name || "Unknown";
            return (
              <div
                key={order.id}
                className="rounded-2xl border border-black/5 bg-white/75 px-4 py-3 text-sm text-black/70"
                role="button"
                tabIndex={0}
                onClick={() => setSelectedOrder(order)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") setSelectedOrder(order);
                }}
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-black/45">
                  <span>{itemLabel}</span>
                  <span>
                    {new Date(order.created_at).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-black/70">
                  <span>{items.length} item(s)</span>
                  <span className="font-semibold text-[color:var(--ink)]">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            );
          })}
          {!ordersLoading && !filteredOrders.length ? (
            <div className="rounded-2xl border border-dashed border-black/10 px-4 py-6 text-center text-sm text-black/50">
              No orders yet.
            </div>
          ) : null}
        </div>
        <div className="mt-6 hidden overflow-x-auto sm:block">
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
              {ordersLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-sm text-black/50"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : null}
              {pagedOrders.map((order) => {
                const items = order.order_items || [];
                const itemsTotal = items.reduce(
                  (sum, item) => sum + item.quantity * item.selling_price,
                  0
                );
                const total = itemsTotal + Number(order.shipping_charge || 0);
                const itemLabel =
                  items.length > 1
                    ? `${items[0]?.products?.name || "Order"} +${
                        items.length - 1
                      }`
                    : items[0]?.products?.name || "Unknown";
                const quantityTotal = items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );
                return (
                  <tr
                    key={order.id}
                    className="text-black/70 hover:bg-black/5 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="py-3">
                      {new Date(order.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td>{itemLabel}</td>
                    <td>{quantityTotal}</td>
                    <td>{formatCurrency(total)}</td>
                  </tr>
                );
              })}
              {!ordersLoading && !filteredOrders.length ? (
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
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-black/60">
          <span>
            Page {orderPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOrderPage((prev) => Math.max(1, prev - 1))}
              disabled={orderPage === 1}
              className="hover:cursor-pointer rounded-full border border-black/10 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() =>
                setOrderPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={orderPage === totalPages}
              className="hover:cursor-pointer rounded-full border border-black/10 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {selectedOrder ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-[var(--shadow)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Order details
                </p>
                <h3 className="mt-2 font-serif text-2xl text-[color:var(--ink)]">
                  {new Date(selectedOrder.created_at).toLocaleDateString(
                    "en-IN"
                  )}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/60"
              >
                Close
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Address
                </p>
                <p className="mt-2 text-sm text-black/70">
                  {selectedOrder.address || "—"}
                </p>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white/80">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.2em] text-black/45">
                      <th className="py-3 px-4">Item</th>
                      <th>Qty</th>
                      <th>Selling</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {(selectedOrder.order_items || []).map((item) => {
                      const lineTotal = item.quantity * item.selling_price;
                      return (
                        <tr key={`${selectedOrder.id}-${item.products?.id}`}>
                          <td className="py-3 px-4">
                            {item.products?.name || "Unknown"}
                          </td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(item.selling_price)}</td>
                          <td>{formatCurrency(lineTotal)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm text-black/70">
                <span>Shipping</span>
                <span className="font-medium">
                  {formatCurrency(selectedOrder.shipping_charge || 0)}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between rounded-2xl border border-black/10 bg-[color:var(--clay)] px-4 py-3 text-sm text-black/70">
                <span className="font-semibold text-[color:var(--ink)]">
                  Order total
                </span>
                <span className="font-semibold text-[color:var(--ink)]">
                  {formatCurrency(
                    (selectedOrder.order_items || []).reduce(
                      (sum, item) => sum + item.quantity * item.selling_price,
                      0
                    ) + Number(selectedOrder.shipping_charge || 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
