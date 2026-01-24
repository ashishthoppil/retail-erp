import crypto from "crypto";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/app/lib/supabase-server";

export async function POST(request) {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const subscriptionId = body?.razorpay_subscription_id;
    const paymentId = body?.razorpay_payment_id;
    const signature = body?.razorpay_signature;

    if (!subscriptionId || !paymentId || !signature) {
      return NextResponse.json(
        { error: "Missing payment verification payload." },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Missing Razorpay key secret." },
        { status: 500 }
      );
    }

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${subscriptionId}|${paymentId}`)
      .digest("hex");

    if (expected !== signature) {
      return NextResponse.json(
        { error: "Payment signature verification failed." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "active",
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_subscription_id", subscriptionId)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ data: { status: "active" } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
