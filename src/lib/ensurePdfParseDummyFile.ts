import fs from "fs";
import https from "https";
import path from "path";
import { tmpdir } from "os";

/**
 * Ensures that the dummy PDF required by pdf-parse is available at runtime.
 * Downloads it to /tmp if it does not exist.
 */
export async function ensurePdfParseDummyFile() {
  const dummyPath = path.join(tmpdir(), "05-versions-space.pdf");

  if (fs.existsSync(dummyPath)) {
    return;
  }

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/test/data/05-versions-space.pdf`;

  console.log("📥 Downloading dummy PDF to:", dummyPath);

  await new Promise<void>((resolve, reject) => {
    const file = fs.createWriteStream(dummyPath);
    https
      .get(url, (res) => {
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log("✅ Dummy PDF ready");
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlinkSync(dummyPath);
        reject(err);
      });
  });
}
