import pdfParse from "pdf-parse";
import fs from "fs";
import path from "path";
import https from "https";
import { tmpdir } from "os";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // ✅ Si estamos en producción (Vercel), creamos el archivo en /tmp
  if (process.env.NODE_ENV === "production") {
    const dummyPath = path.join(tmpdir(), "05-versions-space.pdf");
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/test/data/05-versions-space.pdf`;

    if (!fs.existsSync(dummyPath)) {
      console.log("📥 Descargando dummy PDF a ruta absoluta:", dummyPath);

      await new Promise<void>((resolve, reject) => {
        const file = fs.createWriteStream(dummyPath);
        https
          .get(url, (res) => {
            res.pipe(file);
            file.on("finish", () => {
              file.close();
              resolve();
            });
          })
          .on("error", (err) => {
            fs.unlinkSync(dummyPath);
            reject(err);
          });
      });
    }

    console.log("✅ Dummy PDF está disponible para pdf-parse");
  }

  const data = await pdfParse(buffer);
  return data.text;
}
