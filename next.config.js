/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["uploadthing.com", "utfs.io"],
  },
  /** Linting and typechecking are already done as separate tasks in the CI pipeline */
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

module.exports = nextConfig;
