import { Suspense } from "react";
import CatalogSearchParamsClient from "./CatalogSearchParamsClient";

export const metadata = {
  title: "Catalogue",
  description: "Browse products and place an order.",
};

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white px-6 py-12 sm:px-10">
          <div className="mx-auto w-full max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <p className="text-sm text-slate-500">Loading catalogue...</p>
          </div>
        </div>
      }
    >
      <CatalogSearchParamsClient />
    </Suspense>
  );
}
