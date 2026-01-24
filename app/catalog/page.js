import { Suspense } from "react";
import CatalogSearchParamsClient from "./CatalogSearchParamsClient";

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen px-6 py-12 sm:px-10">
          <div className="mx-auto w-full max-w-6xl rounded-[32px] border border-black/10 bg-white/85 p-8 shadow-[var(--shadow)]">
            <p className="text-sm text-black/60">Loading catalogue...</p>
          </div>
        </div>
      }
    >
      <CatalogSearchParamsClient />
    </Suspense>
  );
}
