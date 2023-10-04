module.exports = {
    parser: '@babel/eslint-parser',
    plugins: ['@babel'],
    extends: 'care',
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    settings: {
        'import/resolver': {
            webpack: {
                config: {
                    resolve: {
                        extensions: ['.js', '.jsx', '.json'],
                        modules: [
                            'app',
                            'app/components',
                            'app/components/common',
                            'app/components/ui',
                            'node_modules',
                        ],
                    },
                },
            },
        },
    },
};
