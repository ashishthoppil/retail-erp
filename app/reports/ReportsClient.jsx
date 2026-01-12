"use client";

import { useEffect, useState } from "react";

const emptyReport = {
  weekly: 0,
  monthly: 0,
  yearly: 0,
};

export default function ReportsClient() {
  const [report, setReport] = useState(emptyReport);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadReports() {
      const response = await fetch("/api/reports");
      const json = await response.json();
      if (!response.ok) {
        setStatus(json.error || "Unable to load reports.");
        return;
      }
      setReport(json.data || emptyReport);
    }
    loadReports();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value || 0);

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
    </div>
  );
}
