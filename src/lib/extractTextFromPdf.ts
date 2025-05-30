import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = undefined as any;

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const loadingTask = getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  let extractedText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ");
    extractedText += pageText + "\n\n";
  }

  return extractedText.trim();
}
