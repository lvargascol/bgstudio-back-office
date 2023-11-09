/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'tailwindui.com',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],
    domains: ['tailwindui.com'],
  },
}

module.exports = nextConfig
