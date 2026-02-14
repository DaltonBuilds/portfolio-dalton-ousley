import type { NextConfig } from "next";
import { build } from "velite";

let veliteStarted = false;

const runVelite = async () => {
  if (veliteStarted) return;
  veliteStarted = true;
  const dev = process.env.NODE_ENV !== "production";
  await build({ watch: dev, clean: !dev });
};

const nextConfig = async (): Promise<NextConfig> => {
  await runVelite();
  
  let config: NextConfig = {
    turbopack: {},
  };

  // Enable bundle analyzer when ANALYZE=true
  if (process.env.ANALYZE === 'true') {
    const withBundleAnalyzer = (await import('@next/bundle-analyzer')).default({
      enabled: true,
    });
    config = withBundleAnalyzer(config);
  }

  return config;
};

export default nextConfig;
