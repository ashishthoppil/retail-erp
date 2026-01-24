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

    const startAt = Math.floor(Date.now() / 1000);
    const expireBy = startAt + 30 * 24 * 60 * 60;

    const subscription = await razorpay.subscriptions.create({
      // "plan_id": "plan_S7eo9kC5B9U1Xf",
      "plan_id": "plan_S7mm8kacz6KeM4",
      "total_count": 12,
      "customer_notify": 1,
    })

    const { error } = await supabase.from("subscriptions").insert({
      user_id: user.id,
      plan_name: "Retail Omega Monthly",
      amount: 89,
      currency: "INR",
      status: "pending",
      razorpay_subscription_id: subscription.id,
    });

    if (error) throw error;
    return NextResponse.json({
      subscription_id: subscription.id,
      url: subscription.short_url
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
