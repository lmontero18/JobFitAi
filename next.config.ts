import type { NextConfig } from "next";
import type { WebpackConfigContext } from "next/dist/server/config-shared";
import fs from "fs";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  webpack(
    config: WebpackConfigContext["config"],
    { isServer }: WebpackConfigContext
  ) {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias || {}),
        canvas: false,
      },
    };

    if (isServer) {
      const srcPath = path.join(
        __dirname,
        "src/test/data/05-versions-space.pdf"
      );
      const destPath = path.join(
        __dirname,
        ".next/test/data/05-versions-space.pdf"
      );

      try {
        if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
          fs.copyFileSync(srcPath, destPath);
          console.log("📎 Copiado 05-versions-space.pdf a .next/test/data");
        } else {
          console.log("✅ El archivo ya existe en .next/test/data");
        }
      } catch (err) {
        console.error("❌ Error al copiar el archivo dummy:", err);
      }
    }

    return config;
  },
};

export default nextConfig;
