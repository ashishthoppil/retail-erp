import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/app/lib/supabase-server";

async function sendWelcomeEmail({ to, appUrl }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from || !to) {
    throw new Error("Missing email configuration.");
  }

  const loginUrl = new URL("/auth", appUrl).toString();
  const html = `
    <div style="background:#f6f5f2;padding:32px;font-family:Arial,Helvetica,sans-serif;color:#141414;">
      <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:20px;padding:28px;border:1px solid #e6e4df;">
        <p style="font-size:12px;letter-spacing:0.3em;text-transform:uppercase;color:#8b7e6b;margin:0 0 12px;">Retail Omega</p>
        <h1 style="font-size:24px;margin:0 0 12px;">Welcome to Retail Omega</h1>
        <p style="font-size:14px;line-height:1.6;margin:0 0 20px;color:#4a4a4a;">
          Your account is ready. Sign in to start organizing inventory, orders, and revenue in one calm workspace.
        </p>
        <a href="${loginUrl}" style="display:inline-block;background:#141414;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:999px;font-size:14px;font-weight:600;">
          Go to login
        </a>
        <p style="font-size:12px;color:#9b9488;margin:20px 0 0;">
          If the button does not work, paste this link into your browser: ${loginUrl}
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
      subject: "Welcome to Retail Omega",
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
    const supabase = await getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (!user.email) {
      return NextResponse.json({ error: "Missing user email." }, { status: 400 });
    }

    const appUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.APP_URL ||
      new URL(request.url).origin;

    await sendWelcomeEmail({ to: user.email, appUrl });

    return NextResponse.json({ sent: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
