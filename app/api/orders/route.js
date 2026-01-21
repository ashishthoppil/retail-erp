import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/app/lib/supabase-server";

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
      .from("orders")
      .select(
        "id, address, shipping_charge, created_at, order_items(quantity, selling_price, products(id, name, buying_price))"
      )
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
    const address = body?.address?.trim();
    const items = Array.isArray(body?.items) ? body.items : [];
    const shippingCharge = Number(body?.shipping_charge || 0);

    if (!address) {
      return NextResponse.json(
        { error: "Address is required." },
        { status: 400 }
      );
    }

    if (!items.length) {
      return NextResponse.json(
        { error: "At least one order item is required." },
        { status: 400 }
      );
    }

    if (Number.isNaN(shippingCharge) || shippingCharge < 0) {
      return NextResponse.json(
        { error: "Shipping charge must be a valid number." },
        { status: 400 }
      );
    }

    const productTotals = new Map();
    const normalizedItems = [];

    for (const item of items) {
      const productId = item?.product_id;
      const quantity = Number(item?.quantity);
      const sellingPrice = Number(item?.selling_price);

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

      productTotals.set(
        productId,
        (productTotals.get(productId) || 0) + quantity
      );

      normalizedItems.push({
        product_id: productId,
        quantity,
        selling_price: sellingPrice,
      });
    }

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, current_quantity")
      .in("id", Array.from(productTotals.keys()))
      .eq("user_id", user.id);

    if (productsError) throw productsError;

    const productMap = new Map(products.map((item) => [item.id, item]));
    const outOfStock = [];

    for (const [productId, totalQty] of productTotals.entries()) {
      const product = productMap.get(productId);
      if (!product) {
        return NextResponse.json(
          { error: "Product not found." },
          { status: 404 }
        );
      }
      if (Number(product.current_quantity) < totalQty) {
        outOfStock.push({
          product_id: productId,
          available: product.current_quantity,
        });
      }
    }

    if (outOfStock.length) {
      return NextResponse.json(
        { error: "Not enough stock available.", out_of_stock: outOfStock },
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
        { error: "Set initial capital before placing orders." },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        address,
        shipping_charge: shippingCharge,
      })
      .select("*")
      .single();

    if (orderError) throw orderError;

    const { error: itemsError } = await supabase.from("order_items").insert(
      normalizedItems.map((item) => ({
        ...item,
        order_id: order.id,
        user_id: user.id,
      }))
    );

    if (itemsError) throw itemsError;

    for (const [productId, totalQty] of productTotals.entries()) {
      const product = productMap.get(productId);
      const remaining = Number(product.current_quantity) - totalQty;
      const { error: updateError } = await supabase
        .from("products")
        .update({ current_quantity: remaining })
        .eq("id", productId)
        .eq("user_id", user.id);

      if (updateError) throw updateError;
    }

    const revenue = normalizedItems.reduce(
      (sum, item) => sum + item.quantity * item.selling_price,
      0
    );
    const newAmount = Number(capital.amount) + revenue + shippingCharge;
    const { error: capitalUpdateError } = await supabase
      .from("capital")
      .update({ amount: newAmount })
      .eq("id", capital.id)
      .eq("user_id", user.id);

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
