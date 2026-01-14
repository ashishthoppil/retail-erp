import AppShell from "../components/AppShell";
import ExpensesClient from "./ExpensesClient";

export default function ExpensesPage() {
  return (
    <AppShell
      title="Add Expenses"
      subtitle="Track every outgoing cost and keep capital up to date."
    >
      <ExpensesClient />
    </AppShell>
  );
}
