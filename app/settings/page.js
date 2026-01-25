"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import Toast from "../components/Toast";
import { getSupabaseBrowser } from "../lib/supabase-browser";

export default function SettingsPage() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [businessName, setBusinessName] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCatalogPrice, setShowCatalogPrice] = useState(true);
  const [showCatalogDescription, setShowCatalogDescription] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = (message) => {
    setToast({ message, visible: true });
    window.setTimeout(() => setToast({ message: "", visible: false }), 2200);
  };

  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !mounted) return;

      const [profileResult, subscriptionResponse] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "business_name, instagram_url, facebook_url, website_url, phone_number, show_catalog_price, show_catalog_description"
          )
          .eq("user_id", user.id)
          .maybeSingle(),
        fetch("/api/subscription"),
      ]);

      if (mounted) {
        const profile = profileResult.data;
        if (profile?.business_name) setBusinessName(profile.business_name);
        if (profile?.instagram_url) setInstagramUrl(profile.instagram_url);
        if (profile?.facebook_url) setFacebookUrl(profile.facebook_url);
        if (profile?.website_url) setWebsiteUrl(profile.website_url);
        if (profile?.phone_number) setPhoneNumber(profile.phone_number);
        if (typeof profile?.show_catalog_price === "boolean") {
          setShowCatalogPrice(profile.show_catalog_price);
        }
        if (typeof profile?.show_catalog_description === "boolean") {
          setShowCatalogDescription(profile.show_catalog_description);
        }
        setLoadingProfile(false);
      }

      if (subscriptionResponse.ok) {
        const json = await subscriptionResponse.json();
        if (mounted) {
          setSubscription(json.data);
        }
      }
      if (mounted) {
        setLoadingPlan(false);
      }
    }

    loadSettings();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      showToast("Please sign in again.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        business_name: businessName.trim(),
        instagram_url: instagramUrl.trim() || null,
        facebook_url: facebookUrl.trim() || null,
        website_url: websiteUrl.trim() || null,
        phone_number: phoneNumber.trim() || null,
        show_catalog_price: showCatalogPrice,
        show_catalog_description: showCatalogDescription,
      },
      { onConflict: "user_id" }
    );

    if (error) {
      showToast(error.message || "Unable to update business name.");
    } else {
      showToast("Business name updated.");
    }
    setSaving(false);
  };

  return (
    <AppShell
      title="Settings"
      subtitle="Manage your business profile and subscription details."
    >
      <Toast message={toast.message} visible={toast.visible} />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-[28px] border border-black/10 bg-white/80 p-6 shadow-[var(--shadow)] backdrop-blur">
          <h2 className="font-serif text-2xl text-[color:var(--ink)]">
            Business profile
          </h2>
          <p className="mt-2 text-sm text-black/60">
            Update the name that appears on your catalog and workspace.
          </p>
          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <label className="block text-xs uppercase tracking-[0.3em] text-[color:var(--sage)]">
              Business name
              <input
                type="text"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="Enter business name"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition focus:border-black/30"
                disabled={loadingProfile}
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-[color:var(--sage)]">
              Instagram handle URL
              <input
                type="url"
                value={instagramUrl}
                onChange={(event) => setInstagramUrl(event.target.value)}
                placeholder="https://instagram.com/yourhandle"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition focus:border-black/30"
                disabled={loadingProfile}
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-[color:var(--sage)]">
              Facebook URL
              <input
                type="url"
                value={facebookUrl}
                onChange={(event) => setFacebookUrl(event.target.value)}
                placeholder="https://facebook.com/yourpage"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition focus:border-black/30"
                disabled={loadingProfile}
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-[color:var(--sage)]">
              Website
              <input
                type="url"
                value={websiteUrl}
                onChange={(event) => setWebsiteUrl(event.target.value)}
                placeholder="https://yourstore.com"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition focus:border-black/30"
                disabled={loadingProfile}
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-[color:var(--sage)]">
              Phone number
              <input
                type="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="+91 98765 43210"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition focus:border-black/30"
                disabled={loadingProfile}
              />
            </label>
            <div className="rounded-2xl border border-black/10 bg-white px-4 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--sage)]">
                Catalog visibility
              </p>
              <div className="mt-3 flex flex-col gap-3 text-sm text-black/70">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={showCatalogPrice}
                    onChange={(event) =>
                      setShowCatalogPrice(event.target.checked)
                    }
                    className="h-4 w-4 rounded border border-black/20"
                    disabled={loadingProfile}
                  />
                  Show price in catalog
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={showCatalogDescription}
                    onChange={(event) =>
                      setShowCatalogDescription(event.target.checked)
                    }
                    className="h-4 w-4 rounded border border-black/20"
                    disabled={loadingProfile}
                  />
                  Show description in catalog
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={saving || loadingProfile}
              className="w-full rounded-full bg-[color:var(--ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        </section>

        <section className="rounded-[28px] border border-black/10 bg-white/80 p-6 shadow-[var(--shadow)] backdrop-blur">
          <h2 className="font-serif text-2xl text-[color:var(--ink)]">
            Current plan
          </h2>
          <p className="mt-2 text-sm text-black/60">
            Review your subscription details.
          </p>
          <div className="mt-6 rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-black/70">
            {loadingPlan ? (
              <p>Loading plan details...</p>
            ) : subscription ? (
              <div className="space-y-2">
                <p className="text-base font-semibold text-[color:var(--ink)]">
                  {subscription.plan_name}
                </p>
                <p>
                  Amount: Rs {subscription.amount} / month
                </p>
                <p>Status: {subscription.status}</p>
                <p className="text-xs text-black/50">
                  Started on{" "}
                  {new Date(subscription.created_at).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p>No active plan found.</p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
