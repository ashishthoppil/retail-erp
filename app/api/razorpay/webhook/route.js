import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Missing webhook secret." },
        { status: 500 }
      );
    }

    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expected) {
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 400 }
      );
    }

    const payload = JSON.parse(rawBody);

    const event = payload.event;
    if (!event) {
      return NextResponse.json({ received: true });
    }

    const subscriptionId = payload.payload?.subscription?.entity?.id;
    const paymentId = payload.payload?.payment?.entity?.id;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Missing subscription id." },
        { status: 400 }
      );
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

    let updatePayload = null;

    if (event === "subscription.charged") {
      updatePayload = {
        status: "active",
        razorpay_payment_id: paymentId,
        updated_at: new Date().toISOString(),
      };
    }

    if (event === "subscription.cancelled") {
      updatePayload = {
        status: "cancelled",
        updated_at: new Date().toISOString(),
      };
    }

    if (!updatePayload) {
      return NextResponse.json({ received: true });
    }

    const { error } = await supabase
      .from("subscriptions")
      .update(updatePayload)
      .eq("razorpay_subscription_id", subscriptionId);

    if (error) throw error;

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
