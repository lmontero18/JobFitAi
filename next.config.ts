import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 👇 Esto es lo importante: forzar el uso de PostCSS
    legacyCss: true,
  },
};

export default nextConfig;
