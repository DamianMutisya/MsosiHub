import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'edamam-product-images.s3.amazonaws.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
    webpack: (config) => {
      config.resolve.alias['@'] = path.resolve(__dirname, 'client');
      return config;
    },
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          // eslint-disable-next-line no-undef
          destination: process.env.NODE_ENV === 'development' 
            ? 'http://localhost:5000/api/:path*' 
            : '/api/:path*',
        },
      ]
    },
  }

export default nextConfig;
