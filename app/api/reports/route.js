import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/app/lib/supabase-server";

function totalRevenue(rows) {
  return rows.reduce((sum, row) => {
    const itemsTotal = (row.order_items || []).reduce(
      (itemSum, item) => itemSum + item.quantity * item.selling_price,
      0
    );
    return sum + itemsTotal + (row.shipping_charge || 0);
  }, 0);
}

export async function GET() {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const [weekly, monthly, yearly] = await Promise.all([
      supabase
        .from("orders")
        .select("shipping_charge, created_at, order_items(quantity, selling_price)")
        .eq("user_id", user.id)
        .gte("created_at", weekStart.toISOString()),
      supabase
        .from("orders")
        .select("shipping_charge, created_at, order_items(quantity, selling_price)")
        .eq("user_id", user.id)
        .gte("created_at", monthStart.toISOString()),
      supabase
        .from("orders")
        .select("shipping_charge, created_at, order_items(quantity, selling_price)")
        .eq("user_id", user.id)
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
