/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const target = process.env.API_PROXY_TARGET || "http://api-gateway:9000";
    return [
      {
        source: "/api/api/:path*",
        destination: `${target}/api/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${target}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
