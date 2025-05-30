const fs = require("fs");
const path = require("path");

const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

const workerSrc = path.join(
  process.cwd(),
  "node_modules",
  "pdfjs-dist",
  "build",
  "pdf.worker.min.js"
);
const workerDest = path.join(publicDir, "pdf.worker.min.js");

fs.copyFileSync(workerSrc, workerDest);
console.log("PDF.js worker file copied successfully!");
