/** @type {import('next').NextConfig} */
const nextConfig = {
  /*async redirects() {
    return [
      {
        source: '/',
        destination: 'https://abc.com',
        permanent: true,
      },
    ];
  },*/
  env: {
    APP_URL: 'http://localhost:3010/api/v1/',
    ACCESS_TOKEN: 'bc7fa89893c47504d75fb25af75520486cff530278fcac776b78b1b50a583efa',
  },
   images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pixabay.com',
        port: '',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig
