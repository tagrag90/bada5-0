/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
      },
      {
        protocol: "https",
        hostname: "t3dy4ejwe7.ufs.sh",
        pathname: "/**",
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' https://*.ufs.sh https://utfs.io data: blob:;
              media-src 'self' https://*.ufs.sh https://utfs.io blob:;
              connect-src 'self' https://*.ufs.sh https://utfs.io;
              font-src 'self';
              frame-src 'self';
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      }
    ];
  }
};

export default nextConfig;
