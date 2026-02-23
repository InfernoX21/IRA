/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/IRA',
    trailingSlash: true,
    optimizeFonts: false,
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
};

export default nextConfig;
