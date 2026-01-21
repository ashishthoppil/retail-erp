import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/app/lib/supabase-server";

async function getLatestCapital(supabase, userId) {
  const { data, error } = await supabase
    .from("capital")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data || null;
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
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
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
    const supabase = await getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const body = await request.json();
    const expense_type = body?.expense_type?.trim();
    const amount = Number(body?.amount);

    if (!expense_type) {
      return NextResponse.json(
        { error: "Expense type is required." },
        { status: 400 }
      );
    }

    if (Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a valid number." },
        { status: 400 }
      );
    }

    const capital = await getLatestCapital(supabase, user.id);
    if (!capital) {
      return NextResponse.json(
        { error: "Set initial capital before adding expenses." },
        { status: 400 }
      );
    }

    const { data: expense, error: expenseError } = await supabase
      .from("expenses")
      .insert({ expense_type, amount, user_id: user.id })
      .select("*")
      .single();

    if (expenseError) throw expenseError;

    const newAmount = Number(capital.amount) - amount;
    const { error: capitalError } = await supabase
      .from("capital")
      .update({ amount: newAmount })
      .eq("id", capital.id)
      .eq("user_id", user.id);

    if (capitalError) throw capitalError;

    return NextResponse.json({ data: expense });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request) {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const body = await request.json();
    const id = body?.id;
    const expense_type = body?.expense_type?.trim();
    const amount = Number(body?.amount);

    if (!id || !expense_type) {
      return NextResponse.json(
        { error: "Expense id and type are required." },
        { status: 400 }
      );
    }

    if (Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a valid number." },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } = await supabase
      .from("expenses")
      .select("id, amount")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (existingError) throw existingError;

    const capital = await getLatestCapital(supabase, user.id);
    if (!capital) {
      return NextResponse.json(
        { error: "Set initial capital before editing expenses." },
        { status: 400 }
      );
    }

    const { data: expense, error: expenseError } = await supabase
      .from("expenses")
      .update({ expense_type, amount })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (expenseError) throw expenseError;

    const delta = amount - Number(existing.amount);
    const newAmount = Number(capital.amount) - delta;
    const { error: capitalError } = await supabase
      .from("capital")
      .update({ amount: newAmount })
      .eq("id", capital.id)
      .eq("user_id", user.id);

    if (capitalError) throw capitalError;

    return NextResponse.json({ data: expense });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const body = await request.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json(
        { error: "Expense id is required." },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } = await supabase
      .from("expenses")
      .select("id, amount")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (existingError) throw existingError;

    const { error: deleteError } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    const capital = await getLatestCapital(supabase, user.id);
    if (!capital) {
      return NextResponse.json(
        { error: "Set initial capital before deleting expenses." },
        { status: 400 }
      );
    }

    const newAmount = Number(capital.amount) + Number(existing.amount);
    const { error: capitalError } = await supabase
      .from("capital")
      .update({ amount: newAmount })
      .eq("id", capital.id)
      .eq("user_id", user.id);

    if (capitalError) throw capitalError;

    return NextResponse.json({ data: { id } });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
