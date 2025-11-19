/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cacheComponents: true, // enables Partial Prerendering (PPR)
  },
};

module.exports = nextConfig;