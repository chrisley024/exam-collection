/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  nextConfig,
  distDir: "build",
  images: {
    domains: ["res.cloudinary.com", "https://res.cloudinary.com/"],
  },
};
