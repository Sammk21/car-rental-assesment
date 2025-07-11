/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["example.com", "images.unsplash.com"],
  },
};

module.exports = config;
