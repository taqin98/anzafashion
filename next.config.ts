import type { NextConfig } from "next";

const collectionImageHosts = (process.env.COLLECTION_IMAGE_HOSTS || "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: collectionImageHosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;
