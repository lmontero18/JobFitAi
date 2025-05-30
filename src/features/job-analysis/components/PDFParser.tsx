"use client";

import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

if (typeof window !== "undefined") {
  const isDev = process.env.NODE_ENV === "development";
  pdfjsLib.GlobalWorkerOptions.workerSrc = isDev
    ? `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
    : "/pdf.worker.min.js";
}

interface PDFParserProps {
  file: File;
  onTextExtracted: (text: string) => void;
  onError: (error: string) => void;
}

export default function PDFParser({
  file,
  onTextExtracted,
  onError,
}: PDFParserProps) {
  const [progress, setProgress] = useState<string>("");

  useEffect(() => {
    const parsePDF = async () => {
      try {
        setProgress("Reading PDF file...");
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        setProgress("Loading PDF document...");
        const loadingTask = pdfjsLib.getDocument({
          data: uint8Array,
          cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
          cMapPacked: true,
        });
        const pdf = await loadingTask.promise;

        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          setProgress(`Processing page ${i} of ${pdf.numPages}...`);
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .filter((item): item is TextItem => "str" in item)
            .map((item) => item.str)
            .join(" ");
          fullText += pageText + "\n\n";
        }

        setProgress("PDF processing completed!");
        onTextExtracted(fullText.trim());
      } catch (error) {
        console.error("Error parsing PDF:", error);
        onError(
          error instanceof Error
            ? error.message
            : "Error processing PDF. Please make sure the file is valid."
        );
      }
    };

    parsePDF();
  }, [file, onTextExtracted, onError]);

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      <span className="text-sm text-gray-600">{progress}</span>
    </div>
  );
}
