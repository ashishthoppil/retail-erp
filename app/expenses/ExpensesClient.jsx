"use client";

import { useEffect, useMemo, useState } from "react";
import Toast from "../components/Toast";

const emptyExpense = {
  expense_type: "",
  amount: "",
};

const PAGE_SIZE = 10;

export default function ExpensesClient() {
  const [form, setForm] = useState(emptyExpense);
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState({ message: "", visible: false });
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [expenseSaving, setExpenseSaving] = useState(false);
  const [expenseUpdatingId, setExpenseUpdatingId] = useState(null);
  const [expenseDeletingId, setExpenseDeletingId] = useState(null);
  const [expenseQuery, setExpenseQuery] = useState("");
  const [expensePage, setExpensePage] = useState(1);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    setExpensePage(1);
  }, [expenseQuery]);

  function showToast(message) {
    setToast({ message, visible: true });
    window.setTimeout(() => {
      setToast({ message: "", visible: false });
    }, 2400);
  }

  async function loadExpenses() {
    setExpensesLoading(true);
    const response = await fetch("/api/expenses");
    const json = await response.json();
    if (!response.ok) {
      setStatus(json.error || "Unable to load expenses.");
      setExpensesLoading(false);
      return;
    }
    setExpenses(json.data || []);
    setExpensesLoading(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");
    setExpenseSaving(true);
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await response.json();
    if (!response.ok) {
      setStatus(json.error || "Unable to save expense.");
      setExpenseSaving(false);
      return;
    }
    setForm(emptyExpense);
    setExpenses((prev) => [json.data, ...prev]);
    showToast("Expense saved.");
    setExpenseSaving(false);
  }

  function startEdit(expense) {
    setEditingId(expense.id);
    setEditingExpense({
      expense_type: expense.expense_type,
      amount: expense.amount,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingExpense(null);
  }

  async function handleUpdate(expenseId) {
    if (!editingExpense) return;
    setStatus("");
    setExpenseUpdatingId(expenseId);
    const response = await fetch("/api/expenses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: expenseId, ...editingExpense }),
    });
    const json = await response.json();
    if (!response.ok) {
      setStatus(json.error || "Unable to update expense.");
      setExpenseUpdatingId(null);
      return;
    }
    setExpenses((prev) =>
      prev.map((item) => (item.id === expenseId ? json.data : item))
    );
    cancelEdit();
    showToast("Expense updated.");
    setExpenseUpdatingId(null);
  }

  async function handleDelete(expenseId) {
    const confirmed = window.confirm("Delete this expense?");
    if (!confirmed) return;
    setStatus("");
    setExpenseDeletingId(expenseId);
    const response = await fetch("/api/expenses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: expenseId }),
    });
    const json = await response.json();
    if (!response.ok) {
      setStatus(json.error || "Unable to delete expense.");
      setExpenseDeletingId(null);
      return;
    }
    setExpenses((prev) => prev.filter((item) => item.id !== expenseId));
    showToast("Expense deleted.");
    setExpenseDeletingId(null);
  }

  const filteredExpenses = useMemo(() => {
    const query = expenseQuery.trim().toLowerCase();
    if (!query) return expenses;
    return expenses.filter((expense) =>
      expense.expense_type?.toLowerCase().includes(query)
    );
  }, [expenses, expenseQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / PAGE_SIZE));

  useEffect(() => {
    setExpensePage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const pagedExpenses = filteredExpenses.slice(
    (expensePage - 1) * PAGE_SIZE,
    expensePage * PAGE_SIZE
  );

  return (
    <div className="space-y-10">
      <Toast message={toast.message} visible={toast.visible} />
      <section className="rounded-[28px] border border-black/10 bg-white/80 p-6 shadow-sm">
        <h2 className="font-serif text-2xl text-[color:var(--ink)]">
          Log an expense
        </h2>
        <p className="mt-2 text-sm text-black/60">
          Record outgoing costs like shipping materials, packaging, or rentals.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em] text-black/50">
              Expense type
            </label>
            <input
              value={form.expense_type}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  expense_type: event.target.value,
                }))
              }
              placeholder="Packaging"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em] text-black/50">
              Amount
            </label>
            <input
              value={form.amount}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, amount: event.target.value }))
              }
              type="number"
              min="0"
              step="0.01"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="hover:cursor-pointer md:col-span-2 rounded-full bg-[color:var(--ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            disabled={expenseSaving}
          >
            {expenseSaving ? "Saving..." : "Save Expense"}
          </button>
        </form>
        {status ? (
          <p className="mt-4 text-sm text-[color:var(--copper)]">{status}</p>
        ) : null}
      </section>

      <section className="rounded-[28px] border border-black/10 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl text-[color:var(--ink)]">
            Expense log
          </h2>
          <input
            value={expenseQuery}
            onChange={(event) => setExpenseQuery(event.target.value)}
            placeholder="Search by item name"
            className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/70 focus:border-[color:var(--sage)] focus:outline-none sm:w-64"
          />
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.2em] text-black/45">
                <th className="py-3">Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {expensesLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-sm text-black/50"
                  >
                    Loading expenses...
                  </td>
                </tr>
              ) : null}
              {pagedExpenses.map((expense) => {
                const isEditing = editingId === expense.id;
                return (
                  <tr key={expense.id} className="text-black/70">
                    <td className="py-3">
                      {isEditing ? (
                        <input
                          value={editingExpense?.expense_type || ""}
                          onChange={(event) =>
                            setEditingExpense((prev) => ({
                              ...prev,
                              expense_type: event.target.value,
                            }))
                          }
                          className="rounded-xl border border-black/10 px-3 py-2 text-xs focus:border-[color:var(--sage)] focus:outline-none"
                        />
                      ) : (
                        <span className="font-medium text-[color:var(--ink)]">
                          {expense.expense_type}
                        </span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingExpense?.amount ?? ""}
                          onChange={(event) =>
                            setEditingExpense((prev) => ({
                              ...prev,
                              amount: event.target.value,
                            }))
                          }
                          className="w-28 rounded-xl border border-black/10 px-3 py-2 text-xs focus:border-[color:var(--sage)] focus:outline-none"
                        />
                      ) : (
                        expense.amount
                      )}
                    </td>
                    <td>
                      {new Date(expense.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdate(expense.id)}
                            className="rounded-full bg-[color:var(--ink)] px-3 py-1 text-[10px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={expenseUpdatingId === expense.id}
                          >
                            {expenseUpdatingId === expense.id
                              ? "Saving..."
                              : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-full border border-black/20 px-3 py-1 text-[10px] disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={expenseUpdatingId === expense.id}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(expense)}
                            className="hover:cursor-pointer rounded-full border border-black/15 px-3 py-1 text-[10px] font-semibold disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={expenseDeletingId === expense.id}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(expense.id)}
                            className="hover:cursor-pointer rounded-full border border-black/10 px-3 py-1 text-[10px] text-black/60 disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={expenseDeletingId === expense.id}
                          >
                            {expenseDeletingId === expense.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!expensesLoading && !filteredExpenses.length ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-sm text-black/50"
                  >
                    No expenses logged yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-black/60">
          <span>
            Page {expensePage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setExpensePage((prev) => Math.max(1, prev - 1))}
              disabled={expensePage === 1}
              className="hover:cursor-pointer rounded-full border border-black/10 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() =>
                setExpensePage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={expensePage === totalPages}
              className="hover:cursor-pointer rounded-full border border-black/10 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
