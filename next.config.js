/** @type {import('next').NextConfig} */

// `output: 'export'` compiles the whole game into a plain `out/` folder of
// HTML, CSS, JS and images. No server, no backend, no AI at runtime.
// That folder can be hosted on Vercel, Netlify, Cloudflare, a cheap shared
// host, or opened straight off a USB stick in a church with no internet.
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

module.exports = nextConfig;
