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
  return {
    turbopack: {},
  };
};

export default nextConfig;
