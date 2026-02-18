/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gujaratnationaltv.pavitrasoft.in",
      },
      {
        protocol: "http",
        hostname: "192.168.1.35",
      },
    ],
  },
};

export default nextConfig;
