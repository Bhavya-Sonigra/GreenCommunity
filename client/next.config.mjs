/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Use different API URLs based on environment
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? 'http://server:5000'  // Container internal communication
      : 'http://localhost:5000';  // Development
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
