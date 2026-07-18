import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
      },
    ],
  },
  async rewrites() {
    // We proxy /api/v1 to the backend to avoid cross-origin cookie & CORS issues.
    // If BACKEND_API_URL is set, we use it; otherwise fallback to localhost:5000/api/v1.
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000/api/v1';
    
    // Ensure we don't end up with double slashes if backendUrl has a trailing slash
    const normalizedBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
    
    return [
      {
        source: '/api/v1/:path*',
        destination: `${normalizedBackendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
