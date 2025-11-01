/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // SCSS configuration
  sassOptions: {
    implementation: 'sass-embedded',
    additionalData: `@use "src/_mantine" as mantine;`,
  },
  
  // Webpack customization
  webpack(config, { isServer }) {
    // SVG as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Fix for packages that depend on fs module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
  
  // API proxy configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
          : 'http://localhost:8000/api/:path*',
      },
    ];
  },
  
  // Headers configuration
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  
  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Transpile packages if needed
  transpilePackages: [
    '@mui/material',
    '@mui/system',
    '@mui/icons-material',
    '@mantine/core',
    '@mantine/hooks',
  ],
  
  // Experimental features for optimization
  experimental: {
    optimizePackageImports: [
      '@mantine/core', 
      '@mantine/hooks', 
      '@mui/material', 
      '@mui/icons-material',
      'lodash',
    ],
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  compress: true,
  
  // Output configuration
  output: 'standalone',
};

export default nextConfig;
