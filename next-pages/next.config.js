/** @type {import('next').NextConfig} */
module.exports = {
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
    reactStrictMode: false,
    images: {
        domains: ['rickandmortyapi.com']
    },
    devIndicators: {
        buildActivity: false
    }
};
