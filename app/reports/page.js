import AppShell from "../components/AppShell";
import ReportsClient from "./ReportsClient";

export default function ReportsPage() {
  return (
    <AppShell
      title="View Reports"
      subtitle="See the revenue momentum across weeks, months, and the year."
    >
      <ReportsClient />
    </AppShell>
  );
}
