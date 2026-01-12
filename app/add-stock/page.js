import AppShell from "../components/AppShell";
import AddStockClient from "./AddStockClient";

export default function AddStockPage() {
  return (
    <AppShell
      title="Add Stock"
      subtitle="Log incoming batches and keep every product detail in one place."
    >
      <AddStockClient />
    </AppShell>
  );
}
