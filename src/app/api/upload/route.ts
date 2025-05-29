import mammoth from "mammoth";
import { extractTextFromPdf } from "@/lib/extractTextFromPdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  console.log("🔥 [UPLOAD] Request received");

  try {
    const formData = await req.formData();
    console.log("📦 [UPLOAD] FormData loaded");

    const file = formData.get("file") as File;
    if (!file) {
      console.log("🚫 [UPLOAD] No file found in formData");
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("📄 [UPLOAD] File received:", file.name, file.type);

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(mimeType)) {
      console.log("🚫 [UPLOAD] Unsupported file type:", mimeType);
      return new Response(JSON.stringify({ error: "Unsupported file type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("✅ [UPLOAD] Valid file type:", mimeType);

    let extractedText = "";

    if (mimeType === "application/pdf") {
      console.log("📚 [UPLOAD] Starting PDF extraction...");
      extractedText = await extractTextFromPdf(buffer);
      console.log("✅ [UPLOAD] PDF extraction completed");
    }

    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      console.log("📚 [UPLOAD] Starting DOCX extraction...");
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
      console.log("✅ [UPLOAD] DOCX extraction completed");
    }

    if (!extractedText.trim()) {
      console.log("⚠️ [UPLOAD] Extracted text is empty");
      return new Response(
        JSON.stringify({ error: "No text could be extracted" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log(
      "🎯 [UPLOAD] Extracted text preview:",
      extractedText.slice(0, 200)
    );
    console.log("🔍 [UPLOAD] extractedText type:", typeof extractedText);

    return new Response(JSON.stringify({ text: extractedText.trim() }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("🔥 [UPLOAD ERROR]", err);
    return new Response(
      JSON.stringify({ error: "Server error", detail: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
