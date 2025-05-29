import pdfParse from "pdf-parse";
import fs from "fs";
import path from "path";
import https from "https";
import { tmpdir } from "os";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  if (process.env.NODE_ENV === "production") {
    const tmpPath = path.join(tmpdir(), "05-versions-space.pdf");
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/test/data/05-versions-space.pdf`;

    if (!fs.existsSync(tmpPath)) {
      console.log("📥 Downloading dummy PDF for pdf-parse...");

      await new Promise<void>((resolve, reject) => {
        const file = fs.createWriteStream(tmpPath);
        https
          .get(url, (response) => {
            response.pipe(file);
            file.on("finish", () => {
              file.close();
              resolve();
            });
          })
          .on("error", (err) => {
            fs.unlinkSync(tmpPath);
            reject(err);
          });
      });

      console.log("✅ Dummy PDF downloaded to:", tmpPath);
    }
  }

  const data = await pdfParse(buffer);
  return data.text;
}
