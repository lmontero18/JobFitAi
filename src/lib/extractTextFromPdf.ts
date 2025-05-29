import pdfParse from "pdf-parse";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (err) {
    console.error("📛 [PDF] Error parsing PDF:", err);
    return ""; // Devuelve vacío si falla
  }
}
