/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date' },
        ],
      },
    ];
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  async rewrites() {
    return [
      {
        source: '/api/aelf/:path*',
        destination: 'https://api.aelf.org/v1/:path*',
      },
      {
        source: '/api/aelf-alt/:path*',
        destination: 'https://www.aelf.org/api/v1/:path*',
      },
    ];
  },
}

export default nextConfig