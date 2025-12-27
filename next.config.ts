import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  },
  redirects: async () => [
    {
      source: '/',
      destination: '/dashboard',
      permanent: true
    }
  ]
};

export default nextConfig;
