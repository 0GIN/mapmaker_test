/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Material-UI configuration
  compiler: {
    emotion: true,
  },
}

module.exports = nextConfig