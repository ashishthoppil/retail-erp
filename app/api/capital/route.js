import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/app/lib/supabase-server";

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const { data, error } = await supabase
      .from("capital")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return NextResponse.json({ data: data || null });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const supabase = getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const body = await request.json();
    const amount = Number(body?.amount);

    if (Number.isNaN(amount)) {
      return NextResponse.json(
        { error: "Amount must be a valid number." },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } = await supabase
      .from("capital")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (existingError && existingError.code !== "PGRST116") {
      throw existingError;
    }

    if (!existing) {
      const { data, error } = await supabase
        .from("capital")
        .insert({ amount, user_id: user.id })
        .select("*")
        .single();

      if (error) throw error;

      return NextResponse.json({ data });
    }

    const newAmount = Number(existing.amount) + amount;
    const { data, error } = await supabase
      .from("capital")
      .update({ amount: newAmount })
      .eq("id", existing.id)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
