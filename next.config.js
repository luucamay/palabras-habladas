/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    XI_API_KEY: process.env.XI_API_KEY,
  }
}

module.exports = nextConfig
