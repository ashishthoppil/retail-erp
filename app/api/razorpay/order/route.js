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

    const { data: existingSubscription, error: existingError } = await supabase
      .from("subscriptions")
      .select("id,status,razorpay_subscription_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existingSubscription?.status === "active") {
      return NextResponse.json(
        { error: "Subscription already active." },
        { status: 409 }
      );
    }

    if (
      existingSubscription?.status === "pending" &&
      existingSubscription?.razorpay_subscription_id
    ) {
      const existingRazorpay = await razorpay.subscriptions.fetch(
        existingSubscription.razorpay_subscription_id
      );
      return NextResponse.json({
        subscription_id: existingRazorpay.id,
        url: existingRazorpay.short_url,
      });
    }
      console.log('existingSubscription');

    const subscription = await razorpay.subscriptions.create({
      // "plan_id": "plan_S7eo9kC5B9U1Xf",
      "plan_id": "plan_S7mm8kacz6KeM4",
      "total_count": 12,
      "customer_notify": 1,
    });

    const subscriptionPayload = {
      user_id: user.id,
      plan_name: "Retail Omega Monthly",
      amount: 89,
      currency: "INR",
      status: "pending",
      razorpay_subscription_id: subscription.id,
    };

    const { error } = existingSubscription?.id
      ? await supabase
          .from("subscriptions")
          .update(subscriptionPayload)
          .eq("id", existingSubscription.id)
      : await supabase.from("subscriptions").insert(subscriptionPayload);

    if (error) throw error;
    return NextResponse.json({
      subscription_id: subscription.id,
      url: subscription.short_url
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
