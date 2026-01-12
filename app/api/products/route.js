import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("*, batches(name)")
      .order("created_at", { ascending: false });

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

export async function POST(request) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const payload = {
      batch_id: body?.batch_id,
      image_url: body?.image_url?.trim() || null,
      name: body?.name?.trim(),
      buying_price: Number(body?.buying_price),
      selling_price: Number(body?.selling_price),
      quantity: Number(body?.quantity),
    };

    if (!payload.batch_id || !payload.name) {
      return NextResponse.json(
        { error: "Batch and product name are required." },
        { status: 400 }
      );
    }

    if (Number.isNaN(payload.buying_price) || payload.buying_price < 0) {
      return NextResponse.json(
        { error: "Buying price must be a valid number." },
        { status: 400 }
      );
    }

    if (Number.isNaN(payload.selling_price) || payload.selling_price < 0) {
      return NextResponse.json(
        { error: "Selling price must be a valid number." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(payload.quantity) || payload.quantity < 0) {
      return NextResponse.json(
        { error: "Quantity must be a whole number." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("products")
      .insert(payload)
      .select("*, batches(name)")
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
