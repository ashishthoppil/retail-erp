"use client";

import { useEffect, useMemo, useState } from "react";
import Toast from "./Toast";
import { getSupabaseBrowser } from "../lib/supabase-browser";
import { CopyIcon } from "lucide-react";

export default function CatalogueLinkCard() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [userId, setUserId] = useState("");
  const [toast, setToast] = useState({ message: "", visible: false });

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || "");
    }
    loadUser();
  }, [supabase]);

  const showToast = (message) => {
    setToast({ message, visible: true });
    window.setTimeout(() => setToast({ message: "", visible: false }), 2000);
  };

  const link =
    typeof window !== "undefined" && userId
      ? `${window.location.origin}/catalog?user_id=${userId}`
      : "";

  async function handleCopy() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    showToast("Catalogue link copied.");
  }

  return (
    <section className="rounded-[28px] border border-black/10 bg-white/85 p-6 shadow-sm">
      <Toast message={toast.message} visible={toast.visible} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-black/50">
            Public Catalogue
          </p>
          <h2 className="mt-3 font-serif text-2xl text-[color:var(--ink)]">
            Share your customer link
          </h2>
          <p className="mt-2 text-sm text-black/60">
            Send this link to customers so they can view your catalogue.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!link}
            className="flex gap-1 items-center rounded-full bg-[color:var(--ink)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
          >
            <CopyIcon className="h-4" />
            Copy catalogue link
          </button>
        </div>
      </div>
      {link ? (
        <p className="mt-4 break-all rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-xs text-black/60">
          {link}
        </p>
      ) : null}
    </section>
  );
}
