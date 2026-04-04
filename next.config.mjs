/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.178.134', 'localhost'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://pizzeria-backend-api.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
