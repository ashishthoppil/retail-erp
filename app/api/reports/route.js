import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase";

function totalRevenue(rows) {
  return rows.reduce((sum, row) => {
    const line = row.quantity * row.selling_price + row.shipping_charge;
    return sum + line;
  }, 0);
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const [weekly, monthly, yearly] = await Promise.all([
      supabase
        .from("orders")
        .select("quantity, selling_price, shipping_charge, created_at")
        .gte("created_at", weekStart.toISOString()),
      supabase
        .from("orders")
        .select("quantity, selling_price, shipping_charge, created_at")
        .gte("created_at", monthStart.toISOString()),
      supabase
        .from("orders")
        .select("quantity, selling_price, shipping_charge, created_at")
        .gte("created_at", yearStart.toISOString()),
    ]);

    if (weekly.error) throw weekly.error;
    if (monthly.error) throw monthly.error;
    if (yearly.error) throw yearly.error;

    return NextResponse.json({
      data: {
        weekly: totalRevenue(weekly.data || []),
        monthly: totalRevenue(monthly.data || []),
        yearly: totalRevenue(yearly.data || []),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
