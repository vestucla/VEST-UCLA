/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'fg5si9hh45.ufs.sh',
        port: '',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
