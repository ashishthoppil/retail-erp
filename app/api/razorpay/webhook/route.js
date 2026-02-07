import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

async function sendSubscriptionEmail({ to, appUrl }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from || !to) {
    return;
  }

  const html = `
    <div style="background:#f6f5f2;padding:32px;font-family:Arial,Helvetica,sans-serif;color:#141414;">
      <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:20px;padding:28px;border:1px solid #e6e4df;">
        <p style="font-size:12px;letter-spacing:0.3em;text-transform:uppercase;color:#8b7e6b;margin:0 0 12px;">Retail Omega</p>
        <h1 style="font-size:24px;margin:0 0 12px;">Payment successful</h1>
        <p style="font-size:14px;line-height:1.6;margin:0 0 20px;color:#4a4a4a;">
          Your subscription is active. You can start using Retail Omega now.
        </p>
        <a href="${appUrl}" style="display:inline-block;background:#141414;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:999px;font-size:14px;font-weight:600;">
          Open Retail Omega
        </a>
        <p style="font-size:12px;color:#9b9488;margin:20px 0 0;">
          If the button does not work, paste this link into your browser: ${appUrl}
        </p>
      </div>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "Your Retail Omega subscription is active!",
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend error: ${errorText}`);
  }
}

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

    const { data: subscriptionRecord, error: subscriptionError } =
      await supabase
        .from("subscriptions")
        .select("id,status,razorpay_payment_id,user_id")
        .eq("razorpay_subscription_id", subscriptionId)
        .maybeSingle();

    if (subscriptionError) throw subscriptionError;

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

    if (
      event === "subscription.charged" &&
      subscriptionRecord?.user_id &&
      subscriptionRecord.status !== "active"
    ) {
      const { data: userData, error: userError } =
        await supabase.auth.admin.getUserById(subscriptionRecord.user_id);
      if (userError) throw userError;

      const email = userData?.user?.email;
      const appUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.APP_URL ||
        new URL(request.url).origin;

      try {
        await sendSubscriptionEmail({ to: email, appUrl });
      } catch (emailError) {
        console.warn("Failed to send subscription email.", emailError);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
