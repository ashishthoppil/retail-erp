import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    if (!userId) {
      return NextResponse.json({ error: "Missing user id." }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      return NextResponse.json(
        { error: "Missing Supabase service role key." },
        { status: 500 }
      );
    }

    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "business_name, instagram_url, facebook_url, website_url, phone_number, show_catalog_price, show_catalog_description"
      )
      .eq("user_id", userId)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      throw profileError;
    }

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, image_url, selling_price, description")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (productsError) throw productsError;

    return NextResponse.json({
      data: {
        business_name: profile?.business_name || "Catalog",
        instagram_url: profile?.instagram_url || null,
        facebook_url: profile?.facebook_url || null,
        website_url: profile?.website_url || null,
        phone_number: profile?.phone_number || null,
        show_catalog_price: profile?.show_catalog_price ?? true,
        show_catalog_description: profile?.show_catalog_description ?? true,
        products: products || [],
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
