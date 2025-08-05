/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['date-fns', 'firebase'],
  },

  // Image optimization
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },

  // Build optimizations
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Compression
  compress: true,

  // Bundle analyzer (optional, uncomment for analysis)
  // webpack: (config, { isServer, dev }) => {
  //   if (!isServer && !dev) {
  //     const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  //     config.plugins.push(new BundleAnalyzerPlugin());
  //   }
  //   return config;
  // },

  webpack: (config, { isServer }) => {
    // Alias '@' → 'src'
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': require('path').resolve(__dirname, 'src'),
    };

    // Fallback dla modułów node w kliencie
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Performance optimizations
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          firebase: {
            test: /[\\/]node_modules[\\/]firebase[\\/]/,
            name: 'firebase',
            chunks: 'all',
            priority: 10,
          },
        },
      },
    };

    return config;
  },
};

module.exports = nextConfig;
