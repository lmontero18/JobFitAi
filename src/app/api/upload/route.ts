import { NextRequest, NextResponse } from "next/server";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
GlobalWorkerOptions.workerSrc = undefined as any;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const loadingTask = getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n\n";
    }

    return NextResponse.json({ text: fullText.trim() });
  } catch (error) {
    console.error("❌ Error processing PDF:", error);
    return NextResponse.json(
      {
        error: "Error processing PDF. Please make sure the file is valid.",
      },
      { status: 500 }
    );
  }
}
