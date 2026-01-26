"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { getSupabaseBrowser } from "../lib/supabase-browser";

export default function AuthPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

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
        toast(error.message);
        setLoading(false);
        return;
      }

      let userId = data?.user?.id;
      if (!data?.session) {
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setStatus(signInError.message);
          toast(signInError.message);
          setLoading(false);
          return;
        }
        userId = signInData?.user?.id;
      }

      if (userId) {
        await supabase
          .from("profiles")
          .upsert({ user_id: userId, business_name: businessName });
      }

      toast("Registration successful.");
      window.setTimeout(() => router.push("/plan"), 900);
    } else {
      const { error } = await supabase.auth.signInWithPassword(payload);
      if (error) {
        setStatus(error.message);
        toast(error.message);
        setLoading(false);
        return;
      }
      toast("Login successful.");
      window.setTimeout(() => router.push("/"), 900);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen px-6 py-12 sm:px-10">
      <div className="mx-auto w-full max-w-lg rounded-[32px] border border-black/10 bg-white/90 p-8 shadow-[var(--shadow)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--sage)]">
          Retail Omega
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
            <div className="relative">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                type={showPassword ? "text" : "password"}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 pr-12 text-sm focus:border-[color:var(--sage)] focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-black/60 hover:text-black"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
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
