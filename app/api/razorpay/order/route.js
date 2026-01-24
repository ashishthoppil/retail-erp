import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/app/lib/supabase-server";

export async function POST() {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Missing Razorpay keys." },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const amount = 4900;
    // const order = await razorpay.orders.create({
    //   amount,
    //   currency: "INR",
    //   receipt: `plan_${user.id}_${Date.now()}`,
    //   notes: { user_id: user.id },
    // });

    const startAt = Math.floor(Date.now() / 1000);
    const expireBy = startAt + 30 * 24 * 60 * 60;

    instance.subscriptions.create({
      "plan_id":"plan_S70QmWUWK7evJn",
      "total_count":1,
      "quantity": 1,
      "customer_notify": false,
      "start_at": startAt,
      "expire_by": expireBy,
      "notes": { user_id: user.id }
    })

    const { error } = await supabase.from("subscriptions").insert({
      user_id: user.id,
      plan_name: "CasaStock Monthly",
      amount: 89,
      currency: "INR",
      status: "pending",
      razorpay_order_id: order.id,
    });

    if (error) throw error;

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
