"use client";

import { useSearchParams } from "next/navigation";
import CatalogClient from "./CatalogClient";

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");

  return <CatalogClient userId={userId} />;
}
