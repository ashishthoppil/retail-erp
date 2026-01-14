import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("orders")
      .select("id, quantity, selling_price, shipping_charge, created_at, products(name)")
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
    const productId = body?.product_id;
    const quantity = Number(body?.quantity);
    const sellingPrice = Number(body?.selling_price);
    const shippingCharge = Number(body?.shipping_charge || 0);

    if (!productId) {
      return NextResponse.json(
        { error: "Product is required." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be a whole number." },
        { status: 400 }
      );
    }

    if (Number.isNaN(sellingPrice) || sellingPrice < 0) {
      return NextResponse.json(
        { error: "Selling price must be a valid number." },
        { status: 400 }
      );
    }

    if (Number.isNaN(shippingCharge) || shippingCharge < 0) {
      return NextResponse.json(
        { error: "Shipping charge must be a valid number." },
        { status: 400 }
      );
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, current_quantity")
      .eq("id", productId)
      .single();

    if (productError) throw productError;

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    const remaining = product.current_quantity - quantity;
    if (remaining < 0) {
      return NextResponse.json(
        { error: "Not enough stock available." },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        product_id: productId,
        quantity,
        selling_price: sellingPrice,
        shipping_charge: shippingCharge,
      })
      .select("*")
      .single();

    if (orderError) throw orderError;

    const { error: updateError } = await supabase
      .from("products")
      .update({ current_quantity: remaining })
      .eq("id", productId);

    if (updateError) throw updateError;

    const { data: capital, error: capitalError } = await supabase
      .from("capital")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (capitalError && capitalError.code !== "PGRST116") {
      throw capitalError;
    }

    if (!capital) {
      return NextResponse.json(
        { error: "Set initial capital before placing orders." },
        { status: 400 }
      );
    }

    const revenue = quantity * sellingPrice + shippingCharge;
    const newAmount = Number(capital.amount) + revenue;
    const { error: capitalUpdateError } = await supabase
      .from("capital")
      .update({ amount: newAmount })
      .eq("id", capital.id);

    if (capitalUpdateError) throw capitalUpdateError;

    return NextResponse.json({ data: order });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
