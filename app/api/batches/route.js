import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("batches")
      .select("*")
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
    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const name = body?.name?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "Batch name is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("batches")
      .insert({ name })
      .select("*")
      .single();

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

export async function PATCH(request) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const id = body?.id;
    const name = body?.name?.trim();

    if (!id || !name) {
      return NextResponse.json(
        { error: "Batch id and name are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("batches")
      .update({ name })
      .eq("id", id)
      .select("*")
      .single();

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

export async function DELETE(request) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json({ error: "Batch id is required." }, { status: 400 });
    }

    const { error } = await supabase.from("batches").delete().eq("id", id);

    if (error) throw error;

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
