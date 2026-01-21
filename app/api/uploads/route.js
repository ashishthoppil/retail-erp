import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/app/lib/supabase-server";

export const runtime = "nodejs";

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Image file is required." },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${user.id}/${Date.now()}-${sanitizeFileName(
      file.name || "image"
    )}`;
    const bucket = "product-images";

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

    return NextResponse.json({
      data: { path: filename, publicUrl: data.publicUrl },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
