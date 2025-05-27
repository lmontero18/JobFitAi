import pdfExtract from "pdf-text-extract";
import { randomUUID } from "crypto";
import path from "path";
import { writeFile, unlink } from "fs/promises";
import os from "os";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const tempPath = path.join(os.tmpdir(), `${randomUUID()}.pdf`);

  try {
    await writeFile(tempPath, buffer);

    return await new Promise((resolve, reject) => {
      pdfExtract(tempPath, { splitPages: false }, async (err, text) => {
        await unlink(tempPath);
        if (err) return reject(err);
        if (!text || !Array.isArray(text))
          return reject(new Error("Failed to extract text"));
        resolve(text.join("\n").trim());
      });
    });
  } catch (err) {
    console.error("[PDF EXTRACT ERROR]", err);
    throw err;
  }
}
