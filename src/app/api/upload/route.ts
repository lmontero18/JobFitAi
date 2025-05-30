import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const text = formData.get("text");

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Aquí podrías procesar el texto, guardarlo, o enviarlo a OpenAI, etc.
    return NextResponse.json({
      message: "Text received",
      preview: text.slice(0, 200),
    });
  } catch (error) {
    console.error("❌ Error in upload API:", error);
    return NextResponse.json(
      { error: "Unexpected error in upload handler." },
      { status: 500 }
    );
  }
}
