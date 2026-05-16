// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['onboarding.duramo.com.br', '*.duramo.com.br'],
    },
  },
};

module.exports = nextConfig;
