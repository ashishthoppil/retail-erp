import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/app/lib/supabase-server";

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const { data, error } = await supabase
      .from("products")
      .select("*, batches(name)")
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
    const supabase = getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const body = await request.json();
    const payload = {
      batch_id: body?.batch_id,
      image_url: body?.image_url?.trim() || null,
      name: body?.name?.trim(),
      buying_price: Number(body?.buying_price),
      selling_price: Number(body?.selling_price),
      initial_quantity: Number(body?.quantity),
      current_quantity: Number(body?.quantity),
      user_id: user.id,
    };

    if (!payload.batch_id || !payload.name) {
      return NextResponse.json(
        { error: "Batch and product name are required." },
        { status: 400 }
      );
    }

    if (Number.isNaN(payload.buying_price) || payload.buying_price < 0) {
      return NextResponse.json(
        { error: "Buying price must be a valid number." },
        { status: 400 }
      );
    }

    if (Number.isNaN(payload.selling_price) || payload.selling_price < 0) {
      return NextResponse.json(
        { error: "Selling price must be a valid number." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(payload.initial_quantity) ||
      payload.initial_quantity < 0
    ) {
      return NextResponse.json(
        { error: "Quantity must be a whole number." },
        { status: 400 }
      );
    }

    const { data: capital, error: capitalError } = await supabase
      .from("capital")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (capitalError && capitalError.code !== "PGRST116") {
      throw capitalError;
    }

    if (!capital) {
      return NextResponse.json(
        { error: "Set initial capital before adding stock." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("products")
      .insert(payload)
      .select("*, batches(name)")
      .single();

    if (error) throw error;

    const stockCost = payload.buying_price * payload.initial_quantity;
    const newAmount = Number(capital.amount) - stockCost;
    const { error: capitalUpdateError } = await supabase
      .from("capital")
      .update({ amount: newAmount })
      .eq("id", capital.id);

    if (capitalUpdateError) throw capitalUpdateError;

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
    const supabase = getSupabaseServer();
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
        { error: "Product id is required." },
        { status: 400 }
      );
    }

    const payload = {
      batch_id: body?.batch_id || null,
      image_url: body?.image_url?.trim() || null,
      name: body?.name?.trim(),
      buying_price: Number(body?.buying_price),
      selling_price: Number(body?.selling_price),
      current_quantity: Number(body?.current_quantity),
    };

    if (!payload.name) {
      return NextResponse.json(
        { error: "Product name is required." },
        { status: 400 }
      );
    }

    if (Number.isNaN(payload.buying_price) || payload.buying_price < 0) {
      return NextResponse.json(
        { error: "Buying price must be a valid number." },
        { status: 400 }
      );
    }

    if (Number.isNaN(payload.selling_price) || payload.selling_price < 0) {
      return NextResponse.json(
        { error: "Selling price must be a valid number." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(payload.current_quantity) ||
      payload.current_quantity < 0
    ) {
      return NextResponse.json(
        { error: "Quantity must be a whole number." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*, batches(name)")
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
    const supabase = getSupabaseServer();
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
        { error: "Product id is required." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

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
