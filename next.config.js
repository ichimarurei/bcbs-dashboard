/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true
});

const nextConfig = {
    async redirects() {
        return [{ source: '/', destination: '/auth', permanent: true }];
    },
    reactStrictMode: true
};

module.exports = withPWA(nextConfig);
