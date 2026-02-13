/** @type {import('next').NextConfig} */
const base_path = process.env.BASE_URL;

const nextConfig = {
  output: "export",
  basePath: base_path,
};

module.exports = nextConfig; // use module.exports for JS files
