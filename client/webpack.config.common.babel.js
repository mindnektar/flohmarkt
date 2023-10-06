import path from 'path';
import { fileURLToPath } from 'url';
import globImporter from 'node-sass-glob-importer';
import WebpackReactComponentNamePlugin from 'webpack-react-component-name';

const isDevelopment = process.env.NODE_ENV !== 'production';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    context: __dirname,

    entry: {
        app: './application/index.jsx',
    },

    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '',
        filename: 'script/[name].js',
        chunkFilename: 'script/[name].js',
    },

    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: [
            'application',
            'application/components',
            'application/components/common',
            'application/components/ui',
            'node_modules',
        ],
    },

    plugins: [
        new WebpackReactComponentNamePlugin(),
    ],

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                resolve: {
                    fullySpecified: false,
                },
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                            plugins: [
                                '@babel/plugin-syntax-dynamic-import',
                                isDevelopment && 'react-refresh/babel',
                            ].filter(Boolean),
                        },
                    },
                ],
            },

            {
                test: /\.sass$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { url: false } },
                    { loader: 'sass-loader', options: { sassOptions: { importer: globImporter() } } },
                ],
            },
        ],
    },
};
