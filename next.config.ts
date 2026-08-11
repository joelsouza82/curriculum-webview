import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Qualquer requisição para /api/ será redirecionada
        destination: 'https://curriculum-go.onrender.com/:path*', // Para a sua API
      },
    ];
  },
};

export default nextConfig;
