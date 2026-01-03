/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Use webpack instead of Turbopack for better compatibility with @metamask/sdk
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fix for @metamask/sdk and other browser-only packages
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Add empty turbopack config to silence the warning
  turbopack: {},
}

export default nextConfig
