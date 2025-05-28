/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    productionBrowserSourceMaps: true,
    turbopack: {
        rules: {
            '*.svg': {
                loaders: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            icon: true,
                            template: require('./svgr-template.js'),
                        },
                    },
                ],
                as: '*.js',
            },
        },
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            issuer: /\.[jt]sx?$/,
            use: [
                {
                    loader: '@svgr/webpack',
                    options: {
                        icon: true,
                        template: require('./svgr-template.js'),
                    },
                },
                'url-loader',
            ],
        });

        return config;
    },
};
