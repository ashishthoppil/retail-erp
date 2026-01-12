import AppShell from "../components/AppShell";
import PlaceOrderClient from "./PlaceOrderClient";

export default function PlaceOrderPage() {
  return (
    <AppShell
      title="Place Order"
      subtitle="Tap a product to log a sale and adjust inventory immediately."
    >
      <PlaceOrderClient />
    </AppShell>
  );
}
