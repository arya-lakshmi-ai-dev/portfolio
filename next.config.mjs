/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow remote project/thumbnail images if you later point to a CDN.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Browsers auto-request /favicon.ico regardless of <link> tags; without this
  // it 404s and some (Brave/Chrome) keep the default globe. Serve the robot SVG.
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon.svg" }];
  },
};

export default nextConfig;
