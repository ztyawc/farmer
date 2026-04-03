import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: [
    "@prisma/adapter-better-sqlite3",
    "@prisma/client",
    "better-sqlite3",
  ],
};

export default nextConfig;
