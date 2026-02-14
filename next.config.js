/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_URL || "";

const nextConfig = {
	output: "export",
	basePath,
	assetPrefix: basePath,
	trailingSlash: true,
};

module.exports = nextConfig;
