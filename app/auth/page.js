"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "../lib/supabase-browser";
import Toast from "../components/Toast";

export default function AuthPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });

  function showToast(message) {
    setToast({ message, visible: true });
    window.setTimeout(() => {
      setToast({ message: "", visible: false });
    }, 2400);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");
    setLoading(true);
    const payload =
      mode === "register"
        ? {
            email,
            password,
            options: { data: { business_name: businessName } },
          }
        : { email, password };

    if (mode === "register") {
      const { data, error } = await supabase.auth.signUp(payload);
      if (error) {
        setStatus(error.message);
        showToast(error.message);
        setLoading(false);
        return;
      }

      if (!data?.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setStatus(signInError.message);
          showToast(signInError.message);
          setLoading(false);
          return;
        }
      }

      showToast("Registration successful.");
      window.setTimeout(() => router.push("/"), 900);
    } else {
      const { error } = await supabase.auth.signInWithPassword(payload);
      if (error) {
        setStatus(error.message);
        showToast(error.message);
        setLoading(false);
        return;
      }
      showToast("Login successful.");
      window.setTimeout(() => router.push("/"), 900);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen px-6 py-12 sm:px-10">
      <Toast message={toast.message} visible={toast.visible} />
      <div className="mx-auto w-full max-w-lg rounded-[32px] border border-black/10 bg-white/90 p-8 shadow-[var(--shadow)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--sage)]">
          Trackza
        </p>
        <h1 className="mt-3 font-serif text-3xl text-[color:var(--ink)]">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-black/60">
          {mode === "login"
            ? "Sign in with your email and password to continue."
            : "Register with your email, password, and business name."}
        </p>

        <div className="mt-6 flex gap-3">
          {[
            { id: "login", label: "Login" },
            { id: "register", label: "Register" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setMode(tab.id);
                setStatus("");
              }}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                mode === tab.id
                  ? "border-transparent bg-[color:var(--clay)] text-black"
                  : "border-black/10 bg-white text-black/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em] text-black/50">
              Email
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              type="email"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em] text-black/50">
              Password
            </label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              type="password"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
              required
            />
          </div>
          {mode === "register" ? (
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-black/50">
                Business name
              </label>
              <input
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="Home Decor Studio"
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-[color:var(--sage)] focus:outline-none"
                required
              />
            </div>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-full bg-[color:var(--ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : mode === "register"
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        {status ? (
          <p className="mt-4 text-sm text-[color:var(--copper)]">{status}</p>
        ) : null}
      </div>
    </div>
  );
}
