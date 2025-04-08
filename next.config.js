/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname + '/src'
    };
    return config;
  },
  reactStrictMode: true,
  swcMinify: true,
  
  // Configure images domains if you're using next/image
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Enable experimental features if needed
  experimental: {
    // Enable server actions if you need them
    // serverActions: true,
  },
  
  // Configure webpack if you need additional loaders or plugins
  webpack: (config, { isServer }) => {
    // Example: Add a rule for SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
  
  // Enable TypeScript type checking in build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;