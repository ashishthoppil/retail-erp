import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request, { params }) {
  try {
    const { userId } = params;
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
      .select("business_name")
      .eq("user_id", userId)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      throw profileError;
    }

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, image_url, selling_price")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (productsError) throw productsError;

    return NextResponse.json({
      data: {
        business_name: profile?.business_name || "Catalog",
        products: products || [],
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
