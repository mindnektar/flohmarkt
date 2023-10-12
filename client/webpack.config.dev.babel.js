import path from 'path';
import { fileURLToPath } from 'url';
import { merge } from 'webpack-merge';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import commonConfig from './webpack.config.common.babel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(commonConfig, {
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 4200,
        compress: false,
        hot: true,
        historyApiFallback: {
            rewrites: [
                { from: /hot-update/, to: (context) => `/${context.parsedUrl.pathname}` },
            ],
        },
    },

    plugins: [
        new ReactRefreshWebpackPlugin(),
    ],

    devtool: 'eval-source-map',

    mode: 'development',
});
